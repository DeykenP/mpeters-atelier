"use client";

import Link from "next/link";
import { useState } from "react";
import type { ImageTone } from "@/types";
import { ProductImage } from "@/components/product/ProductImage";
import { cn } from "@/lib/utils";

interface Entry {
  slug: string;
  name: string;
  count: number;
  image: string;
  tone: ImageTone;
}

/**
 * The collection as a quiet index: names on the left, one photograph on the
 * right that dissolves to whichever category is under the pointer.
 */
export function CategoryIndex({ categories }: { categories: Entry[] }) {
  const [active, setActive] = useState(0);

  return (
    <section className="mx-auto w-full max-w-[1600px] px-6 py-28 md:px-12 md:py-40">
      <div className="mb-14 flex items-end justify-between md:mb-20">
        <h2 className="font-serif text-3xl text-stone-950 md:text-4xl">The Collection</h2>
        <Link
          href="/collections"
          className="border-b border-stone-300 pb-1 text-[10px] uppercase tracking-[0.28em] text-stone-900 transition-colors duration-500 hover:border-stone-900"
        >
          View all
        </Link>
      </div>

      {/* Desktop: index + dissolving photograph */}
      <div className="hidden items-center gap-20 md:grid md:grid-cols-2">
        <ul>
          {categories.map((c, i) => (
            <li key={c.slug}>
              <Link
                href={`/collections/${c.slug}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group flex items-baseline justify-between border-b border-stone-200 py-6"
              >
                <span
                  className={cn(
                    "font-serif text-4xl transition-all duration-700 ease-film lg:text-5xl",
                    active === i ? "translate-x-4 text-stone-950" : "text-stone-300"
                  )}
                >
                  {c.name}
                </span>
                <span
                  className={cn(
                    "text-[10px] tracking-[0.25em] transition-colors duration-700",
                    active === i ? "text-stone-500" : "text-stone-300"
                  )}
                >
                  {String(c.count).padStart(2, "0")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="relative aspect-[4/5] overflow-hidden bg-tile">
          {categories.map((c, i) => (
            <div
              key={c.slug}
              aria-hidden={active !== i}
              className={cn(
                // each layer carries the frame tone: the photo blends into it
                "absolute inset-0 bg-tile transition-[opacity,transform,filter] duration-[1400ms] ease-film",
                active === i ? "scale-100 opacity-100 blur-0" : "scale-[1.05] opacity-0 blur-[6px]"
              )}
            >
              <ProductImage src={c.image} alt={c.name} tone={c.tone} sizes="50vw" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: a calm grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:hidden">
        {categories.map((c) => (
          <Link key={c.slug} href={`/collections/${c.slug}`} className="reveal block">
            <div className="relative aspect-[4/5] overflow-hidden bg-tile">
              <ProductImage src={c.image} alt={c.name} tone={c.tone} size="sm" sizes="50vw" />
            </div>
            <p className="mt-4 text-center font-serif text-lg text-stone-950">{c.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
