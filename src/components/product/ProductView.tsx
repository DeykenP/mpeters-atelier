"use client";

import { useMemo, useState, ViewTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product, ProductVariant } from "@/types";
import { ProductImage } from "./ProductImage";
import { cn, formatPrice, priceLabel, whatsappLink } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const SWATCH: Record<string, string> = {
  gold: "linear-gradient(135deg,#f3dc8a,#c9a227 55%,#9a7a14)",
  rose: "linear-gradient(135deg,#f4d3c8,#d49a86 60%,#b07563)",
  silver: "linear-gradient(135deg,#ffffff,#cfd2d6 55%,#9ea3a8)",
  black: "linear-gradient(135deg,#4a4a4a,#111 60%)",
};

function swatchFor(value: string): string | undefined {
  const v = value.toLowerCase();
  if (v.includes("rose")) return SWATCH.rose;
  if (v.includes("white gold") || v.includes("silver") || v.includes("steel")) return SWATCH.silver;
  if (v.includes("gold")) return SWATCH.gold;
  if (v.includes("black")) return SWATCH.black;
  return undefined;
}

type Selection = Record<string, string>;

const matches = (v: ProductVariant, sel: Selection) =>
  Object.entries(sel).every(([axis, value]) => v.options[axis] === value);

export function ProductView({
  product,
  whatsappNumber,
  categoryName,
}: {
  product: Product;
  whatsappNumber: string;
  categoryName?: string;
}) {
  const options = useMemo(() => product.options ?? [], [product.options]);
  const variants = useMemo(() => product.variants ?? [], [product.variants]);
  const hasColor = options.some((o) => o.name === "Color");

  // The first finish is shown in the photo, so it starts selected.
  const [selection, setSelection] = useState<Selection>((): Selection => {
    const first = variants[0]?.options.Color;
    return hasColor && first ? { Color: first } : {};
  });
  const [image, setImage] = useState(product.featuredImage);

  const candidates = useMemo(() => variants.filter((v) => matches(v, selection)), [variants, selection]);
  const complete = options.length > 0 && options.every((o) => selection[o.name]);
  const variant = complete ? candidates[0] : undefined;

  const select = (axis: string, value: string) => {
    let next: Selection = { ...selection, [axis]: value };
    // keep only the choices that still exist together with the new one
    if (variants.length && !variants.some((v) => matches(v, next))) {
      next = { [axis]: value };
    }
    setSelection(next);
    const shown = variants.find((v) => matches(v, next) && v.image)?.image;
    if (shown) setImage(shown);
  };

  const available = (axis: string, value: string) => {
    if (!variants.length) return true;
    const others = Object.fromEntries(Object.entries(selection).filter(([a]) => a !== axis));
    return variants.some((v) => v.options[axis] === value && matches(v, others));
  };

  const prices = candidates.map((v) => v.price);
  const price = variant
    ? formatPrice(variant.price)
    : prices.length
      ? priceLabel(Math.min(...prices), Math.max(...prices))
      : priceLabel(product.price, product.priceMax);

  const missing = options.filter((o) => !selection[o.name]).map((o) => o.name.toLowerCase());
  const chosen = options
    .filter((o) => selection[o.name])
    .map((o) => `${o.name}: ${selection[o.name]}`)
    .join(", ");
  const message = variant
    ? `Hello M. Peters Atelier, I would like to order the ${product.name} (${chosen}) — code ${variant.sku}, ${formatPrice(variant.price)}.`
    : `Hello M. Peters Atelier, I am interested in the ${product.name}${product.reference ? ` (ref. ${product.reference})` : ""}${chosen ? ` — ${chosen}` : ""}.`;

  const tone = (src: string) => product.imageTones?.[src] ?? "dark";

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
      {/* Gallery */}
      <div className="lg:col-span-7">
        <ViewTransition name={`product-${product.slug}`} share="morph" default="none">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-tile">
            <AnimatePresence initial={false}>
              <motion.div
                key={image}
                className="absolute inset-0 bg-tile"
                initial={{ opacity: 0, scale: 1.02, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease }}
              >
                <ProductImage
                  src={image}
                  alt={product.name}
                  tone={tone(image)}
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </ViewTransition>

        {product.images.length > 1 && (
          <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto">
            {product.images.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setImage(src)}
                aria-label="Show this photo"
                aria-pressed={src === image}
                className={cn(
                  "relative aspect-square w-20 shrink-0 overflow-hidden bg-tile transition-opacity duration-500 md:w-24",
                  src === image ? "opacity-100 ring-1 ring-stone-950" : "opacity-55 hover:opacity-100"
                )}
              >
                <ProductImage src={src} alt="" tone={tone(src)} size="sm" sizes="96px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-32">
          <p className="text-[9px] uppercase tracking-[0.45em] text-stone-400">
            {product.section ?? categoryName}
          </p>
          <h1 className="mt-5 font-serif text-3xl leading-tight text-stone-950 md:text-[2.6rem]">
            {product.name}
          </h1>
          <div className="mt-6 flex items-baseline justify-between gap-6 border-b border-stone-200 pb-8">
            <p className="text-base tracking-[0.08em] text-stone-800">{price}</p>
            <p className="select-all text-right text-[10px] tracking-[0.14em] text-stone-400">
              {variant ? variant.sku : product.reference}
            </p>
          </div>

          {product.description && (
            <p className="mt-8 text-sm font-light leading-loose text-stone-600">{product.description}</p>
          )}

          {/* Options */}
          {options.length > 0 && (
            <div className="mt-10 flex flex-col gap-9">
              {options.map((option) => (
                <fieldset key={option.name}>
                  <legend className="mb-4 flex w-full items-baseline justify-between">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-stone-950">{option.name}</span>
                    <span className="text-[10px] tracking-[0.08em] text-stone-400">
                      {selection[option.name] ?? "Select"}
                    </span>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => {
                      const active = selection[option.name] === value;
                      const ok = available(option.name, value);
                      const swatch = option.name === "Color" ? swatchFor(value) : undefined;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => select(option.name, value)}
                          aria-pressed={active}
                          className={cn(
                            "flex h-10 min-w-12 items-center justify-center gap-2.5 border px-3.5 text-[11px] tracking-[0.06em] transition-colors duration-300",
                            active
                              ? "border-stone-950 bg-stone-950 text-ivory"
                              : "border-stone-300 text-stone-700 hover:border-stone-950",
                            !ok && !active && "border-dashed text-stone-400"
                          )}
                        >
                          {swatch && (
                            <span
                              className="h-3 w-3 rounded-full ring-1 ring-black/10"
                              style={{ background: swatch }}
                              aria-hidden
                            />
                          )}
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
          )}

          {/* Enquiry */}
          <div className="mt-12">
            <a
              href={whatsappLink(whatsappNumber, message)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-full items-center justify-center bg-stone-950 text-[10px] uppercase tracking-[0.32em] text-ivory transition-colors duration-500 hover:bg-stone-800"
            >
              {variant ? "Order via WhatsApp" : "Enquire via WhatsApp"}
            </a>
            <p className="mt-4 text-center text-[10px] tracking-[0.12em] text-stone-400">
              {missing.length > 0 && options.length > 0
                ? `Choose the ${missing.join(" and ")} to order this exact piece.`
                : product.madeToOrder
                  ? "Made to order · price in USD, subject to confirmation"
                  : "Available now · speak directly with the atelier"}
            </p>
          </div>

          {/* Specifications */}
          {(product.specifications.length > 0 || (product.features?.length ?? 0) > 0) && (
            <div className="mt-14 border-t border-stone-200 pt-10">
              <h2 className="mb-7 text-[10px] uppercase tracking-[0.3em] text-stone-950">Details</h2>
              <dl className="flex flex-col">
                {product.specifications.map((spec) => (
                  <div key={spec.name} className="flex items-baseline justify-between gap-8 border-b border-stone-200/70 py-3.5">
                    <dt className="shrink-0 text-[9px] uppercase tracking-[0.22em] text-stone-400">{spec.name}</dt>
                    <dd className="text-right text-[13px] text-stone-800">{spec.value}</dd>
                  </div>
                ))}
              </dl>
              {product.features && product.features.length > 0 && (
                <ul className="mt-6 flex flex-col gap-2 text-[13px] font-light text-stone-600">
                  {product.features.map((f) => (
                    <li key={f}>— {f}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
