import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/product/ProductView";
import { ProductCard } from "@/components/product/ProductCard";
import { allProducts, getCategory, getProduct, relatedTo, toSummary } from "@/lib/catalog";
import { SITE_CONFIG } from "@/lib/constants";
import { priceLabel } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return allProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  const description =
    product.description ||
    [product.section, product.specifications.map((s) => `${s.name}: ${s.value}`).join(" · ")]
      .filter(Boolean)
      .join(" — ");
  return {
    title: product.name,
    description: `${description} ${priceLabel(product.price, product.priceMax)}.`.trim(),
    openGraph: product.featuredImage ? { images: [product.featuredImage] } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProduct((await params).slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = relatedTo(product, 4).map(toSummary);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-5 md:px-12">
      <nav aria-label="Breadcrumb" className="py-6 md:py-8 text-[9px] uppercase tracking-[0.3em] text-stone-400">
        <Link href="/collections" className="transition-colors duration-500 hover:text-stone-900">
          Collection
        </Link>
        {category && (
          <>
            <span className="mx-3">/</span>
            <Link href={`/collections/${category.slug}`} className="transition-colors duration-500 hover:text-stone-900">
              {category.name}
            </Link>
          </>
        )}
      </nav>

      <ProductView product={product} whatsappNumber={SITE_CONFIG.whatsappNumber} categoryName={category?.name} />

      {related.length > 0 && (
        <section className="mt-28 md:mt-40 border-t border-stone-200 pt-20 md:pt-28 pb-28 md:pb-40">
          <h2 className="mb-14 text-center font-serif text-2xl md:text-3xl text-stone-950">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-4 md:gap-x-8">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} className="reveal" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
