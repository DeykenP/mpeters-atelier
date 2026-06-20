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
    <div className="bg-white min-h-screen">
      {/* Collections Hero Section */}
      <section className="relative w-full h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden bg-stone-950">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/collections-hero.jpg"
            alt="M. Peters Atelier Collections"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 tracking-wide drop-shadow-md">
            The Collections
          </h1>
          <div className="w-16 h-[1px] bg-gold-500 mb-6" />
          <p className="text-stone-200 max-w-2xl mx-auto text-base md:text-lg font-light tracking-wide drop-shadow-sm">
            Explore our meticulously curated selection of exceptional timepieces and brilliant jewelry.
          </p>
        </div>
      </section>

      {/* Main Content Area - Server passes data to Client Component */}
      <section className="py-16 md:py-24 container mx-auto px-4 md:px-8">
        <CollectionFilterClient initialProducts={products} categories={categories} />
      </section>
    </div>
  );
}
