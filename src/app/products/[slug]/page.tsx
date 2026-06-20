import { notFound } from "next/navigation";
import { ProductService } from "@/services/product.service";
import { ProductGallery } from "@/components/product/ProductGallery";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { SITE_CONFIG } from "@/lib/constants";
import { MessageCircle } from "lucide-react";

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
    .slice(0, 4);

  // Dynamic WhatsApp Message
  const whatsappMessage = `Hello, I am interested in the ${product.name}.`;
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="bg-white">
      {/* Product Presentation Area */}
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column: Image Gallery (Span 7) */}
          <div className="lg:col-span-7 w-full">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Right Column: Product Information (Span 5, Sticky) */}
          <div className="lg:col-span-5 w-full">
            <div className="sticky top-32 flex flex-col">
              
              {/* Header */}
              <div className="mb-8">
                <span className="text-xs uppercase tracking-[0.2em] text-stone-500 mb-4 block">
                  {product.category}
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-stone-950 mb-4 leading-tight">
                  {product.name}
                </h1>
                <p className="text-xl text-stone-600 tracking-wide">
                  ${product.price.toLocaleString()}
                </p>
              </div>

              {/* Description */}
              <div className="mb-10 text-stone-600 leading-relaxed font-light text-sm md:text-base">
                <p>{product.description}</p>
              </div>

              {/* Inquiry CTA */}
              <div className="flex flex-col gap-4 mb-16">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full block">
                  <Button size="lg" variant="primary" className="w-full flex items-center justify-center gap-3">
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire via WhatsApp</span>
                  </Button>
                </a>
                <p className="text-[10px] text-center text-stone-400 uppercase tracking-widest mt-2">
                  Speak directly with an atelier specialist
                </p>
              </div>

              {/* Specifications Accordion/List */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="border-t border-stone-200 pt-8">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-medium text-stone-900 mb-6">
                    Specifications
                  </h3>
                  <div className="flex flex-col gap-4">
                    {product.specifications.map((spec, idx) => (
                      <div key={idx} className="flex justify-between text-xs border-b border-stone-100 pb-3">
                        <span className="text-stone-400 uppercase tracking-widest text-[9px]">{spec.name}</span>
                        <span className="text-stone-900 text-right max-w-[60%] font-serif tracking-wide">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <section className="bg-stone-50 py-24 border-t border-stone-200">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col items-center mb-16 text-center">
              <h2 className="text-2xl md:text-3xl font-serif text-stone-950 mb-4">You May Also Like</h2>
              <div className="w-12 h-[1px] bg-gold-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} className="bg-white" />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
