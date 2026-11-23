#!/usr/bin/env python3
"""
M. Peters Atelier — catalog extractor.

Turns the M. Peters master catalog PDFs into structured products plus cropped
product photos. The catalog is a table whose layout varies slightly between
sections:

    [Producto] | Imagen | Código | Detalles | [Largo/Talla] | Precio (USD)

It reads the PDF geometry (cell borders, text positions and image placements),
not OCR:

1. Vertical borders give the columns; their roles (name, image, code, details,
   size, price) are inferred from what each column holds.
2. Horizontal borders that cross the image column split the page into product
   groups; borders inside a group split it into variant rows (one code each).
3. Peach title rows become sections ("Stainless Steel Rope Chain - 18K Series").
4. Each group's photo is rendered from the PDF exactly as it is shown in its
   cell, trimmed and saved as WebP.
5. Groups that are the same design in another color, width, carat or length are
   merged into one product with options and per-variant price and code.

Usage:
    python3 -I tools/catalog-extractor/extract.py --out <dir> <pdf> [<pdf> ...]

Output:
    <dir>/products.json      products, options, variants, specifications
    <dir>/images/*.webp      one photo per distinct catalog image
    <dir>/report.txt         anomalies worth a manual look
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import re
import sys
from collections import Counter, OrderedDict, defaultdict
from dataclasses import dataclass, field
from pathlib import Path

import pymupdf
from PIL import Image, ImageChops

# --------------------------------------------------------------------------- #
# Vocabulary
# --------------------------------------------------------------------------- #

PEACH = (0.97, 0.80, 0.68)

HEADER_WORDS = {
    "producto", "imagen", "código", "codigo", "detalles", "largo", "talla",
    "precio", "(usd)", "usd", "size", "length", "tamaño", "medida", "peso",
}

SIZE_LABELS = {"largo": "Length", "talla": "Size", "length": "Length", "size": "Size"}

# Product type token in the code -> site category
TYPE_CATEGORY = {
    "CH": "necklaces",
    "BR": "bracelets",
    "RI": "rings",
    "ER": "earrings",
    "PD": "pendants",
    "AN": "anklets",
}

# Fallback category per catalog file (by filename prefix)
FILE_CATEGORY = [
    ("01_", "necklaces"),
    ("02_", "necklaces"),
    ("MP_03", "earrings"),
    ("MP_04", "rings"),
    ("MP_05", "necklaces"),
    ("MP_06", "earrings"),
]

COLOR_TOKENS = {
    "GD": "Gold",
    "SL": "Silver",
    "RG": "Rose Gold",
    "BK": "Black",
    "SS": "Steel",
    "WG": "White Gold",
    "YG": "Yellow Gold",
    "TT": "Two-Tone",
}

TYPOS = {
    "bracelect": "bracelet",
    "braclet": "bracelet",
    "bracelets": "bracelet",
    "mossanite": "moissanite",
    "moissnaite": "moissanite",
    "moissanit": "moissanite",
    "neckalce": "necklace",
    "necklce": "necklace",
    "icedout": "iced out",
    "earing": "earring",
    "earings": "earrings",
    "pendent": "pendant",
    "infinitylove": "infinity love",
    "opai": "opal",
}

SMALL_WORDS = {"with", "and", "of", "for", "in", "on", "the", "a", "an", "or", "to"}
ACRONYMS = {"cz", "vvs", "vvs1", "vs", "d", "s925", "925", "18k", "14k", "10k", "tw", "st.", "ii", "iii"}

MEASURE_RE = re.compile(
    r"(?<![\w.])(\d+(?:\.\d+)?)\s*(mm|ct\s*tw|cttw|ct|cts|carat|carats)(?![\w])",
    re.I,
)
PRICE_RE = re.compile(r"\$\s*([\d,]+(?:\.\d{1,2})?)")
CODE_SPLIT_RE = re.compile(r"MPAT-?", re.I)


# --------------------------------------------------------------------------- #
# Small geometry helpers
# --------------------------------------------------------------------------- #

@dataclass
class Col:
    x0: float
    x1: float

    @property
    def mid(self) -> float:
        return (self.x0 + self.x1) / 2


@dataclass
class Word:
    x0: float
    y0: float
    x1: float
    y1: float
    text: str
    line: tuple[int, int]
    color: int = 0

    @property
    def cx(self) -> float:
        return (self.x0 + self.x1) / 2

    @property
    def cy(self) -> float:
        return (self.y0 + self.y1) / 2


def close(a: tuple, b: tuple, tol: float = 0.07) -> bool:
    return all(abs(x - y) <= tol for x, y in zip(a, b))


def merge_close(values: list[float], tol: float = 2.0) -> list[float]:
    out: list[float] = []
    for v in sorted(values):
        if out and v - out[-1] <= tol:
            out[-1] = (out[-1] + v) / 2
        else:
            out.append(v)
    return out


def covers(x0: float, x1: float, col: Col, tol: float = 3.0) -> bool:
    return x0 <= col.x0 + tol and x1 >= col.x1 - tol


# --------------------------------------------------------------------------- #
# Page parsing
# --------------------------------------------------------------------------- #

def is_dark(color) -> bool:
    """Cell borders are black/grey; white or pale strokes are hidden gridlines."""
    return color is not None and len(color) >= 3 and max(color[:3]) < 0.75


def page_segments(page: pymupdf.Page):
    """Visible horizontal (y, x0, x1) and vertical (x, y0, y1) cell borders."""
    H: list[tuple[float, float, float]] = []
    V: list[tuple[float, float, float]] = []
    fills: list[tuple[tuple, pymupdf.Rect]] = []
    for d in page.get_drawings():
        fill = d.get("fill")
        stroke = d.get("color") if d.get("type") in ("s", "fs") else None
        for it in d["items"]:
            kind = it[0]
            if kind == "re":
                r = it[1]
                thin_h = r.height <= 3 and r.width > 4
                thin_v = r.width <= 3 and r.height > 4
                if (thin_h or thin_v) and (is_dark(fill) or (fill is None and is_dark(stroke))):
                    if thin_h:
                        H.append(((r.y0 + r.y1) / 2, r.x0, r.x1))
                    else:
                        V.append(((r.x0 + r.x1) / 2, r.y0, r.y1))
                elif fill is not None and not (thin_h or thin_v):
                    fills.append((tuple(fill), r))
            elif kind == "l" and is_dark(stroke):
                p, q = it[1], it[2]
                if abs(p.y - q.y) < 1.5 and abs(p.x - q.x) > 4:
                    H.append(((p.y + q.y) / 2, min(p.x, q.x), max(p.x, q.x)))
                elif abs(p.x - q.x) < 1.5 and abs(p.y - q.y) > 4:
                    V.append(((p.x + q.x) / 2, min(p.y, q.y), max(p.y, q.y)))
    return H, V, fills


def page_columns(V) -> list[Col]:
    totals: dict[float, float] = defaultdict(float)
    for x, y0, y1 in V:
        totals[round(x)] += y1 - y0
    if not totals:
        return []
    # cluster nearby x positions
    clusters: list[list[float]] = []
    for x in sorted(totals):
        if clusters and x - clusters[-1][-1] <= 2.5:
            clusters[-1].append(x)
        else:
            clusters.append([x])
    weighted = [(sum(c) / len(c), sum(totals[x] for x in c)) for c in clusters]
    longest = max(t for _, t in weighted)
    xs = [x for x, t in weighted if t >= 0.3 * longest]
    return [Col(a, b) for a, b in zip(xs, xs[1:]) if b - a > 12]


def page_words(page: pymupdf.Page) -> list[Word]:
    words = []
    for x0, y0, x1, y1, text, block, line, _ in page.get_text("words"):
        text = text.strip()
        if text:
            words.append(Word(x0, y0, x1, y1, text, (block, line)))
    return words


def col_index(cols: list[Col], x: float) -> int | None:
    for i, c in enumerate(cols):
        if c.x0 - 0.5 <= x <= c.x1 + 0.5:
            return i
    return None


def cell_lines(words: list[Word], col: Col, y0: float, y1: float) -> list[list[Word]]:
    """Words inside a cell, grouped into visual lines (top to bottom)."""
    inside = [w for w in words if col.x0 - 1 <= w.cx <= col.x1 + 1 and y0 - 1 <= w.cy <= y1 + 1]
    inside.sort(key=lambda w: (round(w.cy), w.x0))
    lines: list[list[Word]] = []
    for w in inside:
        if lines and abs(lines[-1][-1].cy - w.cy) <= 3.2:
            lines[-1].append(w)
        else:
            lines.append([w])
    for ln in lines:
        ln.sort(key=lambda w: w.x0)
    return lines


def join_line(ln: list[Word]) -> str:
    return " ".join(w.text for w in ln)


def cell_items(words: list[Word], col: Col, y0: float, y1: float) -> list[str]:
    """
    Text of a cell split into its logical items. Spreadsheet cells wrap long
    text onto the next line ("soft" wrap) while explicit line breaks leave a
    short line. A line continues the previous item when the previous line ran
    out of room for the next line's first word.
    """
    lines = cell_lines(words, col, y0, y1)
    items: list[str] = []
    prev: list[Word] | None = None
    for ln in lines:
        text = join_line(ln)
        if prev is not None:
            room = col.x1 - prev[-1].x1
            first = ln[0]
            needed = (first.x1 - first.x0) + 7
            soft = room < needed
            if text[:1].islower() and not prev_text.endswith((";", ".")):
                soft = True  # "plate", "plated", "material" … continue a value
            # "Key: value" lines always start a new item…
            if re.match(r"^[A-Z][A-Za-z0-9 .&/]{1,28}\s?:", text):
                soft = False
                # …unless the key itself was wrapped ("Base" / "Material: …")
                if re.fullmatch(r"[A-Z][a-z]+", prev_text):
                    soft = True
            if prev_text.endswith(":") or prev_text.endswith("-"):
                soft = True
            if soft:
                sep = "" if prev_text.endswith("-") else " "
                items[-1] = items[-1] + sep + text
                prev, prev_text = ln, text
                continue
        items.append(text)
        prev, prev_text = ln, text
    return [re.sub(r"\s+", " ", i).strip() for i in items if i.strip()]


@dataclass
class Variant:
    code: str
    price: float | None
    size: str
    row_name: str
    y: float
    parts: list[str] = field(default_factory=list)


@dataclass
class Group:
    pdf: str
    page: int  # 1-based page in the PDF
    catalog_page: int | None
    section: str
    parent: str
    name: str
    details: list[str]
    variants: list[Variant]
    size_label: str
    image_key: str | None = None
    image_file: str | None = None
    row_names_vary: bool = False


class Extractor:
    def __init__(self, out: Path):
        self.out = out
        self.img_dir = out / "images"
        self.img_dir.mkdir(parents=True, exist_ok=True)
        self.groups: list[Group] = []
        self.report: list[str] = []
        self.image_files: dict[str, str] = {}  # image key -> file name
        self.image_hashes: dict[str, str] = {}  # content hash -> file name
        # The PDFs are consecutive parts of one master catalog: a part starts
        # inside the section (and column layout) where the previous one ended.
        self.carry = {"section": "", "parent": "", "size_label": "Size"}

    def log(self, msg: str) -> None:
        self.report.append(msg)

    # ------------------------------------------------------------------ #
    def run_pdf(self, path: Path) -> None:
        doc = pymupdf.open(path)
        name = path.name
        size_label = self.carry["size_label"]
        section, parent = self.carry["section"], self.carry["parent"]
        titles_run: list[str] = []
        for pno in range(doc.page_count):
            page = doc[pno]
            words = page_words(page)
            prices = [w for w in words if PRICE_RE.search(w.text)]
            if not prices:
                continue  # cover page
            cat_page = None
            m = re.search(r"(\d+)\s*/\s*154", page.get_text())
            if m:
                cat_page = int(m.group(1))

            H, V, fills = page_segments(page)

            # Drop the page footer ("M. PETERS | ATELIER … 12 / 154") and its rule
            footer_y = min(
                (w.y0 for w in words if w.cy > page.rect.height * 0.9
                 and re.search(r"PETERS|PRECIOS|P[ÚU]BLICO", w.text)),
                default=None,
            )
            if footer_y is not None:
                words = [w for w in words if w.cy < footer_y - 1]
            cols = page_columns(V)
            # The outer border is sometimes not drawn: close the table on the
            # side where priced or coded text falls outside the columns.
            if cols:
                right = max((w.x1 for w in words if PRICE_RE.search(w.text) and w.cx > cols[-1].x1), default=None)
                if right is not None:
                    cols.append(Col(cols[-1].x1, right + 2))
                left = min((w.x0 for w in words if w.text.upper().startswith("MPAT") and w.cx < cols[0].x0), default=None)
                if left is not None:
                    cols.insert(0, Col(left - 2, cols[0].x0))
            if len(cols) < 3:
                self.log(f"{name} p{pno+1}: only {len(cols)} columns detected; skipped")
                continue

            # --- column roles ------------------------------------------------
            def votes(pred) -> Counter:
                c = Counter()
                for w in words:
                    if pred(w):
                        i = col_index(cols, w.cx)
                        if i is not None:
                            c[i] += 1
                return c

            price_votes = votes(lambda w: bool(PRICE_RE.search(w.text)))
            code_votes = votes(lambda w: w.text.upper().startswith("MPAT"))
            images = [
                info for info in page.get_image_info(xrefs=True)
                if info["bbox"][3] - info["bbox"][1] > 12 and info["bbox"][2] - info["bbox"][0] > 12
            ]
            img_votes = Counter()
            for info in images:
                b = info["bbox"]
                cx, cy = (b[0] + b[2]) / 2, (b[1] + b[3]) / 2
                if cy > page.rect.height or cy < 60:
                    continue
                i = col_index(cols, cx)
                if i is not None:
                    img_votes[i] += 1
            if not price_votes or not code_votes:
                self.log(f"{name} p{pno+1}: no price/code column; skipped")
                continue
            p_i = price_votes.most_common(1)[0][0]
            c_i = code_votes.most_common(1)[0][0]
            im_i = img_votes.most_common(1)[0][0] if img_votes else None
            if im_i is None and c_i > 0:
                im_i = c_i - 1
            n_i = im_i - 1 if im_i is not None and im_i > 0 else None
            between = p_i - c_i - 1
            if between > 2:
                self.log(f"{name} p{pno+1}: {between} columns between code and price; merged into details")
            roles = dict(name=n_i, image=im_i, code=c_i, price=p_i)
            col = {k: (cols[v] if v is not None else None) for k, v in roles.items()}
            if between == 1:
                col["details"], col["size"] = cols[c_i + 1], None
            elif between >= 2:
                col["details"] = Col(cols[c_i + 1].x0, cols[p_i - 2].x1)
                col["size"] = cols[p_i - 1]
            else:
                col["details"], col["size"] = None, None
            s_i = p_i - 1 if between >= 2 else None

            # --- bands (product groups) -------------------------------------
            boundary_col = col["image"] or col["details"] or col["code"]
            ys = [y for y, x0, x1 in H if covers(x0, x1, boundary_col)]
            # The first and last borders of a page are sometimes drawn only
            # over some columns (a photo covers them, or the group continues
            # from the previous page): they still close the table.
            table_h = [y for y, x0, x1 in H if x1 > cols[0].x0 and x0 < cols[-1].x1]
            if table_h:
                ys += [min(table_h), max(table_h)]
            ys = merge_close(ys, 2.0)
            bands = [(a, b) for a, b in zip(ys, ys[1:]) if b - a > 6]

            for (y0, y1) in bands:
                band_words = [w for w in words if y0 - 1 <= w.cy <= y1 + 1 and cols[0].x0 - 2 <= w.cx <= cols[-1].x1 + 2]
                has_price = any(
                    PRICE_RE.search(w.text) and col_index(cols, w.cx) == p_i for w in band_words
                )
                has_code = any(
                    w.text.upper().startswith("MPAT") and col_index(cols, w.cx) == c_i for w in band_words
                )
                if not has_price and not has_code:
                    texts = [w.text for w in sorted(band_words, key=lambda w: (round(w.cy), w.x0))]
                    lowered = {t.lower() for t in texts}
                    if lowered & {"código", "codigo", "imagen", "detalles"}:
                        # column header row: pick up the size column label
                        if col["size"] is not None:
                            for w in band_words:
                                if col_index(cols, w.cx) == s_i and w.text.lower() in SIZE_LABELS:
                                    size_label = SIZE_LABELS[w.text.lower()]
                        continue
                    peach = any(
                        close(f, PEACH, 0.08) and r.y0 <= y0 + 3 and r.y1 >= y1 - 3
                        and r.width > 0.4 * (cols[-1].x1 - cols[0].x0)
                        for f, r in fills
                    )
                    title = " ".join(t for t in texts if t.lower() not in HEADER_WORDS).strip()
                    title = re.sub(r"\s+", " ", title)
                    if peach and title and "PETERS" not in title:
                        titles_run.append(title)
                    continue

                if titles_run:
                    if len(titles_run) >= 2:
                        parent, section = titles_run[-2], titles_run[-1]
                    else:
                        section = titles_run[-1]
                    titles_run = []

                self.parse_group(
                    page, pno, cat_page, name, words, H, col,
                    (y0, y1), images, section, parent, size_label,
                )

    # ------------------------------------------------------------------ #
    def parse_group(self, page, pno, cat_page, pdf_name, words, H, col,
                    band, images, section, parent, size_label) -> None:
        y0, y1 = band
        self.carry = {"section": section, "parent": parent, "size_label": size_label}

        def splits(c: Col | None) -> list[tuple[float, float]]:
            if c is None:
                return []
            ys = [y0, y1] + [y for y, a, b in H if y0 + 2 < y < y1 - 2 and covers(a, b, c)]
            ys = merge_close(ys, 2.0)
            return [(a, b) for a, b in zip(ys, ys[1:]) if b - a > 4]

        def cell_at(c: Col | None, y: float) -> tuple[float, float] | None:
            for a, b in splits(c):
                if a - 1 <= y <= b + 1:
                    return (a, b)
            return None

        # --- variants: one per code ------------------------------------------
        # Codes are read line by line over the whole group: a line starting
        # with "MPAT" opens a code and the following lines continue it (long
        # codes wrap, sometimes past the row border).
        variants: list[Variant] = []
        for ln in cell_lines(words, col["code"], y0, y1):
            text = "".join(w.text for w in ln)
            if ln[0].text.upper().startswith("MPAT"):
                y = sum(w.cy for w in ln) / len(ln)
                variants.append(Variant(code="", price=None, size="", row_name="", y=y, parts=[text]))
            elif variants:
                variants[-1].parts.append(text)
        for v in variants:
            core = CODE_SPLIT_RE.sub("", "".join(v.parts), count=1).strip("-").replace(" ", "")
            v.code = "MPAT-" + core
        variants = [v for v in variants if len(v.code) > 8]

        if not variants:
            self.log(f"{pdf_name} p{pno+1}: band {y0:.0f}-{y1:.0f} has no code")
            return

        size_cells = splits(col["size"]) if col["size"] is not None else []
        for v in variants:
            pc = cell_at(col["price"], v.y)
            cands = []
            if pc:
                cands = [w for ln in cell_lines(words, col["price"], *pc) for w in ln if PRICE_RE.search(w.text)]
            if not cands:  # nearest price in the group
                cands = [w for ln in cell_lines(words, col["price"], y0, y1) for w in ln if PRICE_RE.search(w.text)]
            if cands:
                best = min(cands, key=lambda w: abs(w.cy - v.y))
                v.price = float(PRICE_RE.search(best.text).group(1).replace(",", ""))
            if col["size"] is not None:
                sc = cell_at(col["size"], v.y)
                if sc:
                    lines = cell_lines(words, col["size"], *sc)
                    if len(size_cells) < len(variants) and len(lines) > 1 and len(lines) >= len(variants):
                        ln = min(lines, key=lambda ln: abs(ln[0].cy - v.y))
                        v.size = join_line(ln)
                    else:
                        v.size = " ".join(join_line(ln) for ln in lines)
            if col["name"] is not None:
                nc = cell_at(col["name"], v.y)
                if nc:
                    lines = [join_line(ln) for ln in cell_lines(words, col["name"], *nc)]
                    # Text that overflowed from the cell above lands on top of
                    # this one; a per-row name starts with its measure ("0.60ct …").
                    starts = [i for i, t in enumerate(lines) if re.match(r"^\d+(\.\d+)?\s*(ct|mm|carat)", t, re.I)]
                    if starts and starts[0] > 0:
                        lines = lines[starts[0]:]
                    v.row_name = " ".join(lines)
            if v.price is None:
                self.log(f"{pdf_name} p{pno+1}: {v.code} has no price")

        # One merged size cell for several codes ("8-12#"): the size of each
        # variant is the numeric tail of its code (…-8, …-9, … -> #8, #9).
        if len(variants) > 1 and len({v.size for v in variants}) == 1:
            tails = [code_tokens(v.code)[-1] for v in variants]
            if len(set(tails)) == len(tails) and all(re.fullmatch(r"\d+(\.\d+)?(in|mm|cm)?", t, re.I) for t in tails):
                shared = variants[0].size
                for v, t in zip(variants, tails):
                    if re.fullmatch(r"\d+(\.\d+)?", t):
                        v.size = f"#{t}" if ("#" in shared or type_of(v.code) == "RI" or "RI" in code_tokens(v.code)) else t
                    else:
                        v.size = t

        names = [v.row_name for v in variants]
        row_names_vary = len(set(names)) > 1
        measured = all(re.match(r"^\d+(\.\d+)?\s*(ct|mm|carat)", n, re.I) for n in names if n)
        if row_names_vary and not measured and len({strip_measures(n)[0].lower() for n in names}) > 1:
            # One name split across row borders ("14mm Moissanite" / "Cuban
            # bracelet"), not one name per row: put the fragments back together.
            joined = " ".join(OrderedDict.fromkeys(n for n in names if n))
            for v in variants:
                v.row_name = joined
            names = [joined] * len(variants)
            row_names_vary = False
        if col["name"] is not None:
            group_name = names[0] if not row_names_vary else ""
        else:
            group_name = ""

        details: list[str] = []
        if col["details"] is not None:
            dcells = splits(col["details"])
            seen = set()
            for v in variants:
                dc = cell_at(col["details"], v.y)
                if dc and dc not in seen:
                    seen.add(dc)
                    details += cell_items(words, col["details"], *dc)
            if len(seen) > 1:
                self.log(f"{pdf_name} p{pno+1}: {variants[0].code} details differ per row ({len(seen)} cells)")

        # --- image -----------------------------------------------------------
        image_key = None
        image_file = None
        if col["image"] is not None:
            c = col["image"]
            inside = []
            for info in images:
                b = pymupdf.Rect(info["bbox"])
                cx, cy = (b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2
                if c.x0 - 2 <= cx <= c.x1 + 2 and y0 <= cy <= y1:
                    inside.append(info)
            if inside:
                union = pymupdf.Rect(inside[0]["bbox"])
                for info in inside[1:]:
                    union |= pymupdf.Rect(info["bbox"])
                clip = union & pymupdf.Rect(c.x0 + 1.2, y0 + 1.2, c.x1 - 1.2, y1 - 1.2) & page.rect
                if not clip.is_empty and clip.width > 10 and clip.height > 10:
                    image_key = f"{pdf_name}:{pno}:" + ",".join(
                        sorted(str(i["xref"]) for i in inside)
                    ) + f":{clip.width:.0f}x{clip.height:.0f}"
                    native = max(
                        (i["width"] / max(1.0, i["bbox"][2] - i["bbox"][0]) for i in inside),
                        default=4.0,
                    )
                    image_file = self.render(page, clip, native, image_key)

        group = Group(
            pdf=pdf_name, page=pno + 1, catalog_page=cat_page, section=section,
            parent=parent, name=group_name, details=details, variants=variants,
            size_label=size_label, image_key=image_key, image_file=image_file,
            row_names_vary=row_names_vary,
        )

        # A group cut by a page break continues at the top of the next page
        # without its name and photo: fold it into the previous group.
        prev = self.groups[-1] if self.groups else None
        if (
            prev is not None and prev.pdf == pdf_name and image_file is None
            and style_of(variants[0].code) == style_of(prev.variants[0].code)
            and type_of(variants[0].code) == type_of(prev.variants[0].code)
        ):
            if not prev.row_names_vary:
                for v in variants:
                    v.row_name = prev.variants[0].row_name
            prev.variants += variants
            prev.row_names_vary = len({v.row_name for v in prev.variants}) > 1
            if prev.row_names_vary:
                prev.name = ""
            if not prev.details:
                prev.details = details
            self.log(f"{pdf_name} p{pno+1}: {variants[0].code} continues the group from the previous page")
            return

        if image_file is None:
            self.log(f"{pdf_name} p{pno+1}: {variants[0].code} has no image")
        self.groups.append(group)

    # ------------------------------------------------------------------ #
    def render(self, page, clip: pymupdf.Rect, native: float, key: str) -> str | None:
        if key in self.image_files:
            return self.image_files[key]
        zoom = max(3.0, min(8.0, native))
        pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=clip, alpha=False)
        img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
        img = trim(img)
        if img.width < 40 or img.height < 40:
            return None
        img.thumbnail((1100, 1100), Image.LANCZOS)
        digest = hashlib.sha1(img.tobytes()).hexdigest()[:12]
        if digest in self.image_hashes:
            self.image_files[key] = self.image_hashes[digest]
            return self.image_hashes[digest]
        fname = f"{digest}.webp"
        img.save(self.img_dir / fname, "WEBP", quality=84, method=6)
        self.image_hashes[digest] = fname
        self.image_files[key] = fname
        return fname


def trim(img: Image.Image, threshold: int = 244, pad_ratio: float = 0.03) -> Image.Image:
    """Crop uniform near-white margins, keeping a small breathing space."""
    gray = img.convert("L")
    mask = gray.point(lambda p: 255 if p < threshold else 0)
    bbox = mask.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    pad = int(max(x1 - x0, y1 - y0) * pad_ratio)
    x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
    x1, y1 = min(img.width, x1 + pad), min(img.height, y1 + pad)
    return img.crop((x0, y0, x1, y1))


# --------------------------------------------------------------------------- #
# Normalisation & merging
# --------------------------------------------------------------------------- #

def code_tokens(code: str) -> list[str]:
    return code.replace("MPAT-", "").split("-")


def style_of(code: str) -> str:
    t = code_tokens(code)
    return t[0] if t else code


def type_of(code: str) -> str | None:
    for tok in code_tokens(code)[1:5]:
        if tok.upper() in TYPE_CATEGORY:
            return tok.upper()
    return None


def color_token(code: str) -> str | None:
    for tok in code_tokens(code)[1:6]:
        if tok.upper() in COLOR_TOKENS:
            return tok.upper()
    return None


def fix_typos(s: str) -> str:
    def repl(m: re.Match) -> str:
        w = m.group(0)
        fixed = TYPOS.get(w.lower())
        if not fixed:
            return w
        return fixed.capitalize() if w[0].isupper() else fixed

    return re.sub(r"[A-Za-z]+", repl, s)


def titlecase(s: str) -> str:
    s = fix_typos(re.sub(r"\s+", " ", s).strip())
    out = []
    for i, word in enumerate(s.split(" ")):
        lead, w = re.match(r"^([^A-Za-z0-9]*)(.*)$", word).groups()
        lw = w.lower()
        if re.search(r"\d", w):
            w2 = re.sub(r"(?i)(\d)(mm|cm|ct|in)\b", lambda m: m.group(1) + m.group(2).lower(), w)
            w2 = re.sub(r"(?i)(\d)k\b", lambda m: m.group(1) + "K", w2)
        elif lw.rstrip(").,") in ACRONYMS:
            w2 = w.upper()
        elif lw in SMALL_WORDS and i > 0:
            w2 = lw
        elif "-" in w:
            w2 = "-".join(p[:1].upper() + p[1:].lower() for p in w.split("-"))
        elif w[:1].isupper() and w[1:].isupper() and len(w) <= 4 and w.isalpha():
            w2 = w  # keep short acronyms as written (NFT, OT)
        else:
            w2 = w[:1].upper() + w[1:].lower()
        out.append(lead + w2)
    return " ".join(out)


PRODUCT_NOUN_RE = re.compile(
    r"(?i)\b(pendants?|earrings?|studs?|hoops?|huggies?|clips?|necklaces?|chains?|bracelets?|rings?|"
    r"cross|charms?|anklets?|coins?|medallions?|bangles?|chokers?|pearls?)\b"
)
COLOR_PHRASE_RE = re.compile(
    r"(?i)\b(?:\d{2}\s?k\s+)?(?:white|yellow|rose)?\s*gold(?:\s+gold)?(?:\s+plated|\s+plate|\s+color)?\b"
)
CATEGORY_NOUN = {
    "necklaces": "Necklace", "bracelets": "Bracelet", "rings": "Ring",
    "earrings": "Earrings", "pendants": "Pendant", "anklets": "Anklet",
}


def clean_name(s: str) -> str:
    s = s.replace("（", "(").replace("）", ")")
    s = re.sub(r"(?i)\bmens\b", "Men's", s)
    s = re.sub(r"(?i)\bwomens\b", "Women's", s)
    s = re.sub(r"(?i)\(\s*fabricante\s*\)|\bfabricante\b", " ", s)
    s = re.sub(r"^(?:[A-Za-z|•·]\s+)+(?=[A-Z0-9])", "", s.strip())  # clipped glyphs from the cell above
    s = re.sub(r"\(\s*\)", " ", s)
    s = re.sub(r"(?i)^silver pin\s+|\s+silver pin$", " ", s)
    s = re.sub(r"(?i)^with\s+\d+(\.\d+)?\s*(inch|in|mm|cm|\")\s+", " ", s)
    s = re.sub(r"(?i)\b\d+(\.\d+)?\s*(inch|inches)\b", " ", s)  # the length is an option
    s = re.sub(r"\b(\w+)( \1\b)+", r"\1", s, flags=re.I)  # "Pendant Pendant"
    s = re.sub(r"\s+", " ", s).strip().strip(";,.").strip()
    # a parenthetical that repeats the name: "Curb Cuban Chain (Curb)"
    for m in re.finditer(r"\s*\(([^)]+)\)", s):
        rest = s.replace(m.group(0), "")
        if m.group(1).strip().lower() in rest.lower():
            s = rest
    return re.sub(r"\s+", " ", s).strip()


def singular_tail(name: str) -> str:
    return re.sub(r"(?i)\b(pendant|necklace|bracelet|ring|anklet|chain)s$", r"\1", name)


def strip_colors(name: str) -> str:
    out = COLOR_PHRASE_RE.sub(" ", name)
    out = re.sub(r"\s+", " ", out).strip(" -–,&")
    return out or name


def clean_title(s: str) -> str:
    s = re.sub(r"\(\s*\)", " ", s)
    s = re.sub(r"(?i)\bfabricante\b", " ", s)
    s = re.sub(r"(?i)^size\s*:\s*\w+\s+", "", s)
    return re.sub(r"\s+", " ", s).strip(" -–")


def strip_measures(name: str) -> tuple[str, list[str]]:
    """'0.50ct Moissanite Earrings (Total 1.00ct)' -> ('Moissanite Earrings', ['0.50ct', '(1.00 ct total)'])"""
    found: list[str] = []
    for m in re.finditer(r"\(([^)]*)\)", name):
        inner = m.group(1)
        if MEASURE_RE.search(inner):
            total = re.sub(r"(?i)^\s*total\s*", "", inner).strip()
            found.append(f"({norm_measure(total)} total)" if total != inner.strip() else f"({inner.strip()})")
            name = name.replace(m.group(0), " ")
    found = [m.group(0) for m in MEASURE_RE.finditer(name)] + found
    base = MEASURE_RE.sub(" ", name)
    base = re.sub(r"\s+", " ", base).strip(" -–,")
    return base, found


def norm_measure(s: str) -> str:
    s = re.sub(r"\s+", " ", s.strip())
    s = re.sub(r"(?i)(\d)\s*(mm)", r"\1mm", s)
    s = re.sub(r"(?i)(\d)\s*ct\s*tw", r"\1 ct TW", s)
    s = re.sub(r"(?i)(\d)\s*(cts?|carats?)\b", r"\1 ct", s)
    return s


def norm_size(s: str) -> str:
    s = re.sub(r"\s+", " ", s.strip())
    s = s.replace("''", '"').replace("”", '"').replace("“", '"').replace("′′", '"')
    s = re.sub(r"(\d)\s*\"", r'\1"', s)
    s = re.sub(r"(?i)(\d)\s*(mm|cm)\b", r"\1\2", s)
    s = re.sub(r"(?i)adjustabl\s*e", "adjustable", s)
    return s


def parse_details(items: list[str]) -> tuple[list[dict], list[str]]:
    specs, features = [], []
    for it in items:
        it = fix_typos(it).strip()
        if it.endswith(":") or it.lower() in {"base", "main", "material"}:
            continue  # value clipped in the PDF cell
        if ":" in it[:40]:
            k, v = it.split(":", 1)
            k = re.sub(r"\s+", " ", k).strip().rstrip(";")
            v = re.sub(r"\s+", " ", v).strip().rstrip(";")
            if k and v:
                specs.append({"name": k[:1].upper() + k[1:].lower(), "value": v})
                continue
        features.append(it.rstrip(";"))
    return specs, features


def color_label(token: str | None, specs: list[dict], features: list[str]) -> str:
    txt = " ".join([s["value"] for s in specs if s["name"].lower().startswith("color")] + features).lower()
    if "rose" in txt:
        return "Rose Gold"
    if "white gold" in txt:
        return "White Gold"
    if "two" in txt and "tone" in txt:
        return "Two-Tone"
    m = re.search(r"(\d{2})k\s*(yellow\s*)?gold", txt)
    if token in ("GD", "YG") or (token is None and m):
        return f"{m.group(1)}K Gold" if m else "Gold"
    if token == "SL":
        if "steel" in txt:
            return "Steel"
        if "silver" in txt:
            return "Silver"
        return "Silver"
    if token == "BK" or "black" in txt:
        return "Black"
    if token:
        return COLOR_TOKENS[token]
    if "silver" in txt:
        return "Silver"
    if "steel" in txt:
        return "Steel"
    if "gold" in txt:
        return "Gold"
    return ""


def material_of(text: str) -> str:
    t = text.lower()
    if "moissanite" in t:
        return "moissanite"
    if "925" in t or "sterling" in t:
        return "sterling-silver"
    if "stainless" in t or "steel" in t:
        return "stainless-steel"
    if "brass" in t or "cz" in t or "zircon" in t:
        return "brass"
    return "other"


def slugify(s: str) -> str:
    s = s.lower().replace("&", " and ")
    s = re.sub(r"[^a-z0-9.]+", "-", s)
    s = s.replace(".", "-")
    return re.sub(r"-+", "-", s).strip("-")


def member_rows(e: dict) -> list[dict]:
    """Variant rows of one catalog group, with their raw option values."""
    g = e["g"]
    group_measures = strip_measures(e["raw_name"])[1] if not g.row_names_vary else []
    rows = []
    for v in g.variants:
        measures = strip_measures(v.row_name)[1] if g.row_names_vary else group_measures
        rows.append(dict(
            sku=v.code,
            price=v.price,
            color=e["color"],
            measure=" ".join(norm_measure(m) for m in measures),
            size=norm_size(v.size),
            image=g.image_file,
            size_label=g.size_label,
        ))
    return rows


def partition(members: list[dict]) -> list[list[dict]]:
    """Keep apart groups whose variants would be indistinguishable once merged."""
    subs: list[dict] = []
    for e in members:
        sigs = {(r["color"], r["measure"], r["size"]) for r in e["rows"]}
        for sub in subs:
            if not (sub["sigs"] & sigs):
                sub["members"].append(e)
                sub["sigs"] |= sigs
                break
        else:
            subs.append({"members": [e], "sigs": set(sigs)})
    return [s["members"] for s in subs]


def merge_correlated(axes: "OrderedDict[str, list[str]]") -> None:
    """Fold axes that move together (carat and stone size) into one."""
    changed = True
    while changed:
        changed = False
        names = list(axes)
        for i in range(len(names)):
            for j in range(i + 1, len(names)):
                a, b = axes[names[i]], axes[names[j]]
                if len(set(zip(a, b))) == len(set(a)) == len(set(b)):
                    axes[names[i]] = [f"{x} · {y}" for x, y in zip(a, b)]
                    del axes[names[j]]
                    changed = True
                    break
            if changed:
                break


def build_products(groups: list[Group], report: list[str]) -> list[dict]:
    # ---- enrich groups --------------------------------------------------------
    enriched = []
    for g in groups:
        specs, features = parse_details(g.details)
        color = color_label(color_token(g.variants[0].code), specs, features)
        raw_name = clean_name(g.name)
        if not raw_name and not g.row_names_vary:
            # No name column: the first detail line that names the piece
            # ("Lion pendant", "15mm Hoop Earrings"), else the section title.
            cand = next(
                (f for f in features if PRODUCT_NOUN_RE.search(f) and ":" not in f and len(f) < 70),
                "",
            )
            if cand:
                features = [f for f in features if f != cand]
            raw_name = clean_name(cand) or clean_title(g.section) or "Piece"
        e = dict(g=g, specs=specs, features=features, color=color, raw_name=raw_name)
        if g.row_names_vary:
            # rows read "0.50ct Black moissanite", "0.60ct Black moissanite stud"…:
            # the most complete wording names the product
            bases = [strip_measures(clean_name(v.row_name))[0] for v in g.variants]
            e["base"] = Counter(bases).most_common(1)[0][0]
            longest = max(bases, key=len)
            if all(longest.lower().startswith(b.lower()) for b in bases):
                e["base"] = longest
        else:
            e["base"] = strip_measures(raw_name)[0]
        e["base"] = clean_name(strip_colors(e["base"]))
        e["rows"] = member_rows(e)
        enriched.append(e)

    # A lone noun ("12mm Bracelet") borrows the wording of a sibling with the
    # same style number ("12mm Cuban chain" -> "Cuban Bracelet").
    by_style = defaultdict(list)
    for e in enriched:
        by_style[(e["g"].pdf, style_of(e["g"].variants[0].code))].append(e)
    for e in enriched:
        own = e["base"].split()
        if len(own) == 1 and PRODUCT_NOUN_RE.fullmatch(own[0]):
            for sib in by_style[(e["g"].pdf, style_of(e["g"].variants[0].code))]:
                sw = sib["base"].split()
                if len(sw) >= 2 and PRODUCT_NOUN_RE.fullmatch(sw[-1]):
                    e["base"] = " ".join(sw[:-1] + own)
                    break

    # ---- same design in another color / width / carat / length -> one product
    buckets: "OrderedDict[tuple, list]" = OrderedDict()
    for e in enriched:
        g = e["g"]
        key = (
            g.pdf, g.section, style_of(g.variants[0].code), type_of(g.variants[0].code),
            re.sub(r"[^a-z0-9]+", " ", fix_typos(e["base"]).lower()).strip(),
        )
        buckets.setdefault(key, []).append(e)

    products = []
    used_slugs: Counter = Counter()
    for members_all in buckets.values():
        for members in partition(members_all):
            p = make_product(members, report)
            if p is None:
                continue
            used_slugs[p["slug"]] += 1
            if used_slugs[p["slug"]] > 1:
                p["slug"] = f"{p['slug']}-{used_slugs[p['slug']]}"
            products.append(p)
    return products


def make_product(members: list[dict], report: list[str]) -> dict | None:
    g0 = members[0]["g"]
    section = clean_title(g0.section)
    base = clean_name(members[0]["base"])
    if len(base.split()) < 2 and section:
        base = section  # "Hoop" alone says less than "Dangle Earrings"
    name = singular_tail(titlecase(base) or titlecase(section) or "Piece")
    rows = [r for e in members for r in e["rows"]]

    # ---- category -------------------------------------------------------------
    category = TYPE_CATEGORY.get(type_of(g0.variants[0].code) or "")
    sect = f"{g0.parent} {section} {name}".lower()
    if "anklet" in sect:
        category = "anklets"
    elif "pendant" in sect and category in (None, "necklaces"):
        category = "pendants"
    if category is None:
        category = next((c for p, c in FILE_CATEGORY if g0.pdf.startswith(p)), "necklaces")
    if not PRODUCT_NOUN_RE.search(name):
        name = f"{name} {CATEGORY_NOUN[category]}"

    # ---- option axes ------------------------------------------------------------
    measures = [r["measure"] for r in rows]
    if any("ct" in m for m in measures) and not any("mm" in m for m in measures):
        measure_axis = "Carat"
    elif category in ("necklaces", "bracelets", "anklets", "rings"):
        measure_axis = "Width"
    else:
        measure_axis = "Size"
    size_axis = rows[0]["size_label"] or "Size"
    if size_axis == measure_axis:
        measure_axis = "Stone" if category in ("earrings", "pendants", "rings") else "Width"

    # same color/measure/size for several codes: tell them apart by the code
    sig = Counter((r["color"], r["measure"], r["size"]) for r in rows)
    style_values = None
    if any(c > 1 for c in sig.values()):
        toks = [code_tokens(r["sku"]) for r in rows]
        common = set(toks[0]).intersection(*map(set, toks[1:]))
        style_values = ["-".join(t for t in tk if t not in common) or r["sku"] for tk, r in zip(toks, rows)]
        report.append(f"'{name}' ({rows[0]['sku']}): variants told apart by code -> {sorted(set(style_values))}")

    sizes = [r["size"] for r in rows]
    length_re = re.compile(r'^\d+(\.\d+)?("|cm)?(\s*\+\s*\d+(\.\d+)?)?\s*("|cm)?$', re.I)
    if category != "rings" and sizes and all(length_re.match(s) for s in sizes if s) and any(
        ('"' in s or "cm" in s.lower()) for s in sizes
    ):
        size_axis = "Length"
        if measure_axis == "Length":
            measure_axis = "Width"

    axes: "OrderedDict[str, list[str]]" = OrderedDict()
    axes["Color"] = [r["color"] for r in rows]
    axes[measure_axis] = measures
    axes[size_axis] = sizes
    if style_values:
        axes["Style"] = style_values

    fixed_specs = []
    for ax in list(axes):
        distinct = [v for v in OrderedDict.fromkeys(axes[ax]) if v]
        if len(distinct) <= 1:
            if distinct and ax != "Color":
                fixed_specs.append({"name": ax, "value": distinct[0]})
            del axes[ax]
        elif any(not v for v in axes[ax]):
            axes[ax] = [v or "Standard" for v in axes[ax]]
    merge_correlated(axes)

    def order(values: list[str]) -> list[str]:
        """Sizes in numeric order (16", 18"…, #5, #5.5…); colors as listed."""
        uniq = list(OrderedDict.fromkeys(values))
        nums = [re.match(r"^#?\s*(\d+(?:\.\d+)?)", v) for v in uniq]
        if all(nums):
            return [v for _, v in sorted(zip((float(m.group(1)) for m in nums), uniq), key=lambda t: t[0])]
        return uniq

    options = [{"name": ax, "values": order(vals)} for ax, vals in axes.items()]
    variants = [
        {"sku": r["sku"], "price": r["price"], "options": {ax: axes[ax][i] for ax in axes}, "image": r["image"]}
        for i, r in enumerate(rows)
    ]
    prices = [v["price"] for v in variants if v["price"] is not None]
    if not prices:
        report.append(f"no prices for '{name}' {rows[0]['sku']}; skipped")
        return None
    for v in variants:
        if v["price"] is None:
            report.append(f"'{name}' {v['sku']}: missing price, uses lowest")
            v["price"] = min(prices)

    # ---- specifications ---------------------------------------------------------
    specs, features, seen = [], [], set()
    multi_color = "Color" in axes
    for e in members:
        for s in e["specs"]:
            k = s["name"].lower()
            if multi_color and k.startswith("colo"):
                continue
            if k not in seen:
                seen.add(k)
                specs.append(s)
        for f in e["features"]:
            if f not in features and f.lower() != name.lower():
                features.append(f)
    for s in fixed_specs:
        if s["name"].lower() not in seen:
            specs.append(s)

    # A detail that one option already chooses ("Width: 2mm" on a chain sold in
    # 2–4mm, "Ring size: #5 … #8") describes only the first row: drop it.
    axis_names = {a.lower() for a in axes}

    def chosen_by_option(spec_name: str) -> bool:
        n = spec_name.lower()
        if any(a in n for a in axis_names):
            return True
        if "carat" in axis_names and ("main stone" in n or "carat" in n):
            return True
        return "length" in axis_names and n in ("length", "chain length")

    specs = [s for s in specs if not chosen_by_option(s["name"])]

    colors = [c for c in OrderedDict.fromkeys(r["color"] for r in rows) if c]
    style = style_of(g0.variants[0].code)
    slug = slugify(f"{name} {colors[0] if len(colors) == 1 else ''} {style}")
    blob = " ".join(
        [name, section, g0.parent] + [f"{s['name']} {s['value']}" for s in specs] + features
        + [r["sku"] for r in rows[:1]]
    )
    if re.search(r"-MO-|-MO$", rows[0]["sku"]):
        blob += " moissanite"
    meaningful = section and section.lower() not in {"others", "other"} and not re.match(r"^\d{4}-series$", section, re.I)
    return dict(
        slug=slug,
        name=name,
        category=category,
        material=material_of(blob),
        section=titlecase(section) if meaningful else "",
        parent=titlecase(clean_title(g0.parent)) if g0.parent else "",
        reference=f"MPAT-{style}",
        colors=colors,
        price=min(prices),
        priceMax=max(prices),
        images=list(OrderedDict.fromkeys(r["image"] for r in rows if r["image"])),
        options=options,
        variants=variants,
        specifications=specs,
        features=features,
        source={"pdf": g0.pdf, "page": g0.page, "catalogPage": g0.catalog_page},
    )


# --------------------------------------------------------------------------- #

def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("pdfs", nargs="+", type=Path)
    ap.add_argument("--out", required=True, type=Path)
    args = ap.parse_args()

    ex = Extractor(args.out)
    for pdf in args.pdfs:
        print(f"· {pdf.name}", file=sys.stderr)
        ex.run_pdf(pdf)

    products = build_products(ex.groups, ex.report)

    # Name each photo after the first product that shows it, drop unused ones
    img_dir = args.out / "images"
    renamed: dict[str, str] = {}
    for p in products:
        for i, f in enumerate(p["images"], 1):
            if f not in renamed:
                renamed[f] = f"{p['slug']}-{i}.webp"
    for f in img_dir.glob("*.webp"):
        if f.name in renamed:
            f.rename(img_dir / ("_" + renamed[f.name]))
        else:
            f.unlink()
    for f in img_dir.glob("_*.webp"):
        f.rename(img_dir / f.name[1:])
    for p in products:
        p["images"] = [renamed[f] for f in p["images"]]
        for v in p["variants"]:
            if v["image"]:
                v["image"] = renamed[v["image"]]
    used = set(renamed.values())

    # Size and background tone of each photo: light (studio white) photos are
    # shown whole on the page tone, dark ones fill their frame.
    image_meta = {}
    for f in sorted(used):
        with Image.open(img_dir / f) as im:
            g = im.convert("L")
            w, h = g.size
            border = [g.getpixel((x, y)) for x in range(0, w, 3) for y in (0, h - 1)]
            border += [g.getpixel((x, y)) for y in range(0, h, 3) for x in (0, w - 1)]
            tone = "light" if sum(border) / len(border) > 200 else "dark"
            image_meta[f] = {"w": w, "h": h, "tone": tone}

    (args.out / "products.json").write_text(
        json.dumps(
            {"format": "mpeters-catalog/v1", "images": image_meta, "products": products},
            ensure_ascii=False, indent=1,
        )
    )
    (args.out / "report.txt").write_text("\n".join(ex.report) + "\n")
    (args.out / "groups.json").write_text(json.dumps([
        dict(pdf=g.pdf, page=g.page, section=g.section, name=g.name, image=g.image_file,
             details=g.details, rows=[[v.code, v.price, v.size, v.row_name] for v in g.variants])
        for g in ex.groups
    ], ensure_ascii=False, indent=1))
    n_var = sum(len(p["variants"]) for p in products)
    print(
        f"groups={len(ex.groups)} products={len(products)} variants={n_var} "
        f"images={len(used)} report_lines={len(ex.report)}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
