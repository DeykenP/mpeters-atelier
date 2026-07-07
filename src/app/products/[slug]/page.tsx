import { notFound } from "next/navigation";
import { ProductService } from "@/services/product.service";
import { ProductGallery } from "@/components/product/ProductGallery";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { SITE_CONFIG } from "@/lib/constants";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await ProductService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, excluding current)
  const related = (await ProductService.getProductsByCategory(product.category))
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const whatsappMessage = `Hello, I am interested in the ${product.name}.`;
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="bg-background">
      {/* Product Presentation Area */}
      <div className="container mx-auto px-6 md:px-12 py-16 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-24">

          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 w-full">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Right Column: Product Information (Sticky) */}
          <div className="lg:col-span-5 w-full">
            <div className="sticky top-36 flex flex-col">

              {/* Header */}
              <div className="mb-10">
                <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mb-5 block">
                  {product.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-serif text-stone-950 mb-5 leading-tight">
                  {product.name}
                </h1>
                <p className="text-base text-stone-600 tracking-[0.1em] font-light">
                  ${product.price.toLocaleString()}
                </p>
              </div>

              {/* Description */}
              <div className="mb-12 text-stone-600 leading-loose font-light text-sm">
                <p>{product.description}</p>
              </div>

              {/* Inquiry CTA */}
              <div className="flex flex-col gap-4 mb-16">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full block">
                  <Button size="lg" variant="primary" className="w-full">
                    Inquire via WhatsApp
                  </Button>
                </a>
                <p className="text-[9px] text-center text-stone-400 uppercase tracking-[0.25em] mt-2">
                  Speak directly with an atelier specialist
                </p>
              </div>

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="border-t border-stone-200 pt-10">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-medium text-stone-950 mb-8">
                    Specifications
                  </h3>
                  <div className="flex flex-col gap-5">
                    {product.specifications.map((spec, idx) => (
                      <div key={idx} className="flex justify-between items-baseline border-b border-stone-200/70 pb-4">
                        <span className="text-stone-400 uppercase tracking-[0.2em] text-[9px]">{spec.name}</span>
                        <span className="text-stone-900 text-right max-w-[60%] font-serif text-sm tracking-wide">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-24 md:py-32 border-t border-stone-200">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center mb-16 text-center">
              <h2 className="text-2xl md:text-3xl font-serif text-stone-950">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
