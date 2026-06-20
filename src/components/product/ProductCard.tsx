import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  return (
    <Link href={`/products/${product.slug}`} className={cn("group flex flex-col", className)}>
      <div className="relative aspect-[4/5] bg-[#F9F9F9] overflow-hidden mb-5">
        {/* Product Badges - Minimalist */}
        {product.featured && (
          <div className="absolute top-4 left-4 z-10 text-stone-900 text-[8px] tracking-[0.3em] uppercase">
            Exceptional
          </div>
        )}
        <Image
          src={product.featuredImage}
          alt={product.name}
          fill
          className="object-cover object-center transition-all duration-[2s] ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {/* Subtle Dark Overlay on Hover for Luxury Feel */}
        <div className="absolute inset-0 bg-stone-950/0 transition-colors duration-700 group-hover:bg-stone-950/[0.03]" />
      </div>
      
      <div className="flex flex-col flex-1 items-center text-center px-4">
        <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400 mb-2">
          {product.category}
        </span>
        <h3 className="font-serif text-base md:text-lg text-stone-900 leading-snug mb-2 group-hover:opacity-60 transition-opacity duration-300">
          {product.name}
        </h3>
        <span className="text-[11px] text-stone-500 mt-auto tracking-[0.15em] font-light">
          ${product.price.toLocaleString()}
        </span>
      </div>
    </Link>
  );
}
