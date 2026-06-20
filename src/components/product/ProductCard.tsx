import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  return (
    <Link href={`/products/${product.slug}`} className={cn("group flex flex-col", className)}>
      <div className="relative aspect-[4/5] bg-stone-50 overflow-hidden mb-6">
        {/* Product Badges */}
        {product.featured && (
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-stone-900 text-[10px] tracking-[0.2em] uppercase px-3 py-1 font-medium border border-stone-200">
            Featured
          </div>
        )}
        <Image
          src={product.featuredImage}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {/* Subtle Dark Overlay on Hover for Luxury Feel */}
        <div className="absolute inset-0 bg-stone-950/0 transition-colors duration-500 group-hover:bg-stone-950/5" />
      </div>
      
      <div className="flex flex-col flex-1 items-center text-center">
        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-3">
          {product.category}
        </span>
        <h3 className="font-serif text-lg md:text-xl text-stone-900 leading-tight mb-3 group-hover:text-gold-600 transition-colors duration-300">
          {product.name}
        </h3>
        <span className="text-sm text-stone-600 mt-auto tracking-wider">
          ${product.price.toLocaleString()}
        </span>
      </div>
    </Link>
  );
}
