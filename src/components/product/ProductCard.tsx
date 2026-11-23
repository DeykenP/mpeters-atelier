import Link from "next/link";
import { ViewTransition } from "react";
import type { ProductSummary } from "@/types";
import { ProductImage } from "./ProductImage";
import { cn, priceLabel } from "@/lib/utils";

export function ProductCard({
  product,
  priority,
  className,
}: {
  product: ProductSummary;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn("group block", className)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-tile">
        {/* Same name as the photo on the product page: it travels there */}
        <ViewTransition name={`product-${product.slug}`} share="morph" default="none">
          <ProductImage
            src={product.image}
            alt={product.name}
            tone={product.tone}
            priority={priority}
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="transition-transform duration-[1600ms] ease-film group-hover:scale-[1.045]"
          />
        </ViewTransition>
      </div>
      <div className="mt-5 px-1 text-center">
        <h3 className="font-serif text-[15px] md:text-base leading-snug text-stone-950 transition-opacity duration-500 group-hover:opacity-60">
          {product.name}
        </h3>
        <p className="mt-2 text-[11px] tracking-[0.14em] text-stone-500">
          {priceLabel(product.price, product.priceMax)}
        </p>
      </div>
    </Link>
  );
}
