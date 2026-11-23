"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ProductSummary } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { MATERIALS } from "@/data/categories";
import { cn, colorFamily } from "@/lib/utils";

const PAGE = 24;
const SORTS = {
  featured: "Featured",
  "price-asc": "Price, low to high",
  "price-desc": "Price, high to low",
} as const;
type Sort = keyof typeof SORTS;

/** Product type in catalog codes -> category */
const CODE_TYPES: Record<string, string> = {
  CH: "necklaces",
  BR: "bracelets",
  RI: "rings",
  ER: "earrings",
  PD: "pendants",
  AN: "anklets",
};

export function ProductGrid({ items }: { items: ProductSummary[] }) {
  const [query, setQuery] = useState("");
  const [material, setMaterial] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("featured");
  // how many cards are on screen, counted per selection: a new search or
  // filter starts again from the first rows
  const selectionKey = `${query}|${material}|${color}|${sort}`;
  const [paging, setPaging] = useState({ key: selectionKey, shown: PAGE });
  const shown = paging.key === selectionKey ? paging.shown : PAGE;
  const [refineOpen, setRefineOpen] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  const materials = useMemo(
    () => Object.keys(MATERIALS).filter((m) => items.some((p) => p.material === m)),
    [items]
  );
  const colors = useMemo(() => {
    const fam = new Set(items.flatMap((p) => p.colors.map(colorFamily)).filter(Boolean));
    return ["Gold", "Silver", "Rose Gold", "Black"].filter((c) => fam.has(c));
  }, [items]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    // A catalog code ("MPAT-0014-CH-GD-3mm-20in" or just "0014") finds its
    // design; the type in a full code (CH, ER, RI…) tells designs that share
    // a number apart.
    const code = q.match(/(?:mpat-?\s*)?(\d{4})/)?.[1];
    const type = q
      .toUpperCase()
      .split(/[-\s]+/)
      .map((t) => CODE_TYPES[t])
      .find(Boolean);
    let list = items.filter((p) => {
      if (material && p.material !== material) return false;
      if (color && !p.colors.some((c) => colorFamily(c) === color)) return false;
      if (!q) return true;
      if (code) {
        // pendants are sold on chains, so their codes can read CH
        const typeOk = !type || p.category === type || (type === "necklaces" && p.category === "pendants");
        return (p.reference?.endsWith(code) ?? false) && typeOk;
      }
      return q.split(/\s+/).every((word) => p.search.includes(word));
    });
    if (sort !== "featured") {
      list = [...list].sort((a, b) => (sort === "price-asc" ? a.price - b.price : b.price - a.price));
    }
    return list;
  }, [items, query, material, color, sort]);

  // load the next rows as the end of the grid comes into view
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        setPaging((p) => ({
          key: selectionKey,
          shown: (p.key === selectionKey ? p.shown : PAGE) + PAGE,
        }));
      },
      { rootMargin: "800px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [selectionKey, shown, results.length]);

  const active = (material ? 1 : 0) + (color ? 1 : 0);
  const visible = results.slice(0, shown);

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-12 md:mb-16 flex flex-col gap-6 border-b border-stone-200 pb-5 md:flex-row md:items-end md:justify-between">
        <label className="relative block w-full md:max-w-xs">
          <span className="sr-only">Search the collection</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or code"
            className="w-full bg-transparent pb-2 text-sm font-light tracking-wide text-stone-950 placeholder:text-stone-400 focus:outline-none"
          />
        </label>
        <div className="flex items-center justify-between gap-8 md:justify-end">
          <span className="text-[10px] uppercase tracking-[0.28em] text-stone-400">
            {results.length} {results.length === 1 ? "piece" : "pieces"}
          </span>
          <button
            type="button"
            onClick={() => setRefineOpen((o) => !o)}
            aria-expanded={refineOpen}
            className="text-[10px] uppercase tracking-[0.28em] text-stone-900"
          >
            Refine{active ? ` (${active})` : ""}
            <span className={cn("ml-2 inline-block transition-transform duration-500", refineOpen && "rotate-45")}>+</span>
          </button>
        </div>
      </div>

      {/* Refine panel */}
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-700 ease-film",
          refineOpen ? "grid-rows-[1fr] opacity-100 mb-14" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="grid gap-10 md:grid-cols-3">
            {materials.length > 1 && (
              <FilterGroup title="Material">
                {materials.map((m) => (
                  <Chip key={m} active={material === m} onClick={() => setMaterial(material === m ? null : m)}>
                    {MATERIALS[m]}
                  </Chip>
                ))}
              </FilterGroup>
            )}
            {colors.length > 1 && (
              <FilterGroup title="Color">
                {colors.map((c) => (
                  <Chip key={c} active={color === c} onClick={() => setColor(color === c ? null : c)}>
                    {c}
                  </Chip>
                ))}
              </FilterGroup>
            )}
            <FilterGroup title="Sort">
              {(Object.keys(SORTS) as Sort[]).map((s) => (
                <Chip key={s} active={sort === s} onClick={() => setSort(s)}>
                  {SORTS[s]}
                </Chip>
              ))}
            </FilterGroup>
          </div>
        </div>
      </div>

      {/* Grid */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-3 md:gap-x-8 md:gap-y-20 xl:grid-cols-4">
          {visible.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 4} className="reveal" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-28 text-center">
          <p className="font-serif text-xl text-stone-950">No pieces match.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setMaterial(null);
              setColor(null);
            }}
            className="mt-8 border-b border-stone-300 pb-1 text-[10px] uppercase tracking-[0.28em] text-stone-900 transition-colors duration-500 hover:border-stone-900"
          >
            Clear the search
          </button>
        </div>
      )}

      {shown < results.length && <div ref={sentinel} className="h-px" aria-hidden />}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-5 text-[9px] uppercase tracking-[0.35em] text-stone-400">{title}</h3>
      <div className="flex flex-wrap gap-2.5">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-9 border px-4 text-[10px] uppercase tracking-[0.2em] transition-colors duration-500",
        active ? "border-stone-950 bg-stone-950 text-ivory" : "border-stone-300 text-stone-700 hover:border-stone-950"
      )}
    >
      {children}
    </button>
  );
}
