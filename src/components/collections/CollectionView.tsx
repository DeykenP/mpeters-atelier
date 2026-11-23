import Link from "next/link";
import type { Category } from "@/types";
import { ProductGrid } from "./ProductGrid";
import { collectionIndex, listingOrder, toSummary } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/** Shared by /collections (everything) and /collections/[category]. */
export function CollectionView({ category }: { category?: Category }) {
  const index = collectionIndex();
  const items = listingOrder(category?.slug).map(toSummary);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-5 md:px-12 pb-28 md:pb-40">
      <header className="pt-14 md:pt-24 pb-10 md:pb-14 text-center">
        <p className="text-[9px] uppercase tracking-[0.5em] text-stone-400">
          {category ? "The Collection" : "Made to order"}
        </p>
        <h1 className="mt-6 font-serif text-4xl md:text-6xl text-stone-950">
          {category?.name ?? "The Collection"}
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-stone-500">
          {category?.description ??
            "Every piece is made for you. Choose the finish and the size, and we confirm the details with you directly."}
        </p>
      </header>

      <nav
        aria-label="Categories"
        className="no-scrollbar -mx-5 mb-12 md:mb-14 flex gap-8 overflow-x-auto px-5 md:mx-0 md:justify-center md:gap-12 md:px-0"
      >
        <Tab href="/collections" active={!category}>
          All
        </Tab>
        {index.map((c) => (
          <Tab key={c.slug} href={`/collections/${c.slug}`} active={category?.slug === c.slug}>
            {c.name}
          </Tab>
        ))}
      </nav>

      <ProductGrid key={category?.slug ?? "all"} items={items} />
    </div>
  );
}

function Tab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative shrink-0 pb-3 text-[10px] uppercase tracking-[0.28em] transition-colors duration-500",
        "after:absolute after:bottom-0 after:left-0 after:h-px after:bg-stone-950 after:transition-all after:duration-700 after:ease-film",
        active ? "text-stone-950 after:w-full" : "text-stone-400 hover:text-stone-800 after:w-0"
      )}
    >
      {children}
    </Link>
  );
}
