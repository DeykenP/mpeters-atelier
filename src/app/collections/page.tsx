import { ProductService } from "@/services/product.service";
import { CollectionFilterClient } from "@/components/collections/CollectionFilterClient";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections | M. Peters Atelier",
  description: "Explore our meticulously curated selection of exceptional timepieces and brilliant jewelry.",
};

export default async function CollectionsPage() {
  const [products, categories] = await Promise.all([
    ProductService.getProducts(),
    ProductService.getCategories(),
  ]);

  return (
    <div className="bg-background min-h-screen">
      {/* Collections Hero */}
      <section className="relative w-full h-[45vh] min-h-[360px] flex items-end overflow-hidden bg-stone-950">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/collections-hero.png"
            alt=""
            fill
            className="object-cover opacity-70"
            priority
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-2/3 z-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
        <div className="relative z-10 container mx-auto px-6 md:px-12 pb-16 md:pb-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-ivory tracking-wide mb-4">
            The Collections
          </h1>
          <p className="text-ivory/70 max-w-md text-sm font-light tracking-wide leading-relaxed">
            A meticulously curated selection of exceptional timepieces and brilliant jewelry.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20 md:py-28 container mx-auto px-6 md:px-12">
        <CollectionFilterClient initialProducts={products} categories={categories} />
      </section>
    </div>
  );
}
