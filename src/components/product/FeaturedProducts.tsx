import { ProductService } from "@/services/product.service";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export async function FeaturedProducts() {
  const featuredProducts = await ProductService.getFeaturedProducts();
  const productsToShow = featuredProducts.slice(0, 4);

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-gold-600 mb-4 font-medium">Curated Selection</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-stone-950 mb-6">Featured Collections</h2>
          <div className="w-16 h-[1px] bg-stone-300 mb-8" />
          <p className="text-stone-600 max-w-2xl text-sm md:text-base leading-relaxed">
            Explore a curated selection of our most exceptional pieces, meticulously chosen for their brilliance, heritage, and timeless design.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {productsToShow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Section Footer / CTA */}
        <div className="mt-20 flex justify-center">
          <Link href="/collections">
            <Button variant="outline" className="border-stone-300 text-stone-900 hover:bg-stone-950 hover:text-white hover:border-stone-950">
              View All Collections
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
