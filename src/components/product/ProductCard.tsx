import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { cn } from "@/lib/utils";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  return (
    <Link href={`/products/${product.slug}`} className={cn("group flex flex-col", className)}>
      <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden mb-6">
        <Image
          src={product.featuredImage}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-[1.8s] ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>

      <div className="flex flex-col flex-1 items-center text-center px-2">
        <h3 className="font-serif text-base md:text-lg text-stone-950 leading-snug mb-2 group-hover:opacity-60 transition-opacity duration-500">
          {product.name}
        </h3>
        <span className="text-[11px] text-stone-500 mt-auto tracking-[0.15em] font-light">
          ${product.price.toLocaleString()}
        </span>
      </div>
    </Link>
  );
}
