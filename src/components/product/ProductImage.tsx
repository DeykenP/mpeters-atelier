import Image from "next/image";
import type { ImageTone } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  src: string;
  alt: string;
  tone: ImageTone;
  sizes: string;
  /** "sm" (600 px) for grids and thumbnails, "lg" (1200 px) for the product page */
  size?: "sm" | "lg";
  priority?: boolean;
  className?: string;
}

/** Catalog photos ship in two sizes: /catalog/<file> and /catalog/sm/<file>. */
function sized(src: string, size: "sm" | "lg"): string {
  return size === "sm" && src.startsWith("/catalog/") ? src.replace("/catalog/", "/catalog/sm/") : src;
}

/**
 * Catalog photos come in two kinds: studio shots on white, shown whole and
 * blended into the warm frame, and lifestyle shots on dark, which fill it.
 * Catalog files are already sized WebP, so they are served as they are.
 */
export function ProductImage({ src, alt, tone, sizes, size = "lg", priority, className }: Props) {
  if (!src) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-serif text-2xl tracking-[0.3em] text-stone-300">MP</span>
      </div>
    );
  }
  return (
    <Image
      src={sized(src, size)}
      alt={alt}
      fill
      sizes={sizes}
      loading={priority ? "eager" : undefined}
      fetchPriority={priority ? "high" : undefined}
      unoptimized={src.startsWith("/catalog/")}
      className={cn(
        tone === "light" ? "object-contain p-[9%] mix-blend-multiply" : "object-cover",
        className
      )}
    />
  );
}
