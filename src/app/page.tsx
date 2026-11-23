import Link from "next/link";
import { Hero } from "@/components/ui/Hero";
import { CategoryIndex } from "@/components/home/CategoryIndex";
import { ProductCard } from "@/components/product/ProductCard";
import { collectionIndex, featuredProducts, toSummary } from "@/lib/catalog";
import { SITE_CONFIG } from "@/lib/constants";
import { whatsappLink } from "@/lib/utils";

export default function Home() {
  const index = collectionIndex();
  const featured = featuredProducts(8).map(toSummary);

  return (
    <>
      <Hero
        frames={["/images/hero/home-hero.png", "/images/hero/collections-hero.png"]}
        eyebrow="M. Peters Atelier"
        headline="Fine jewelry, made to order."
        subheadline="Moissanite, sterling silver and gold — chosen by you, finished for you."
        cta={{ label: "Explore the collection", href: "/collections" }}
      />

      {/* Statement */}
      <section className="mx-auto max-w-3xl px-6 pt-28 text-center md:pt-40">
        <p className="reveal font-serif text-2xl leading-relaxed text-stone-900 md:text-[2rem] md:leading-[1.5]">
          Every piece begins with a choice — the finish, the width, the length. We make it
          to your measure and confirm each detail with you personally.
        </p>
      </section>

      <CategoryIndex categories={index} />

      {/* Selected pieces */}
      <section className="mx-auto w-full max-w-[1600px] px-6 pb-28 md:px-12 md:pb-40">
        <div className="mb-14 flex items-end justify-between md:mb-20">
          <h2 className="font-serif text-3xl text-stone-950 md:text-4xl">Selected pieces</h2>
          <Link
            href="/collections"
            className="border-b border-stone-300 pb-1 text-[10px] uppercase tracking-[0.28em] text-stone-900 transition-colors duration-500 hover:border-stone-900"
          >
            Shop all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-4 md:gap-x-8 md:gap-y-20">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} className="reveal" />
          ))}
        </div>
      </section>

      {/* Made for you */}
      <section className="border-t border-stone-200/70">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-28 text-center md:py-40">
          <p className="text-[9px] uppercase tracking-[0.5em] text-stone-400">By enquiry</p>
          <h2 className="reveal mt-6 font-serif text-3xl text-stone-950 md:text-5xl">Made for you.</h2>
          <p className="reveal mt-7 max-w-md text-sm font-light leading-relaxed text-stone-500">
            Send us a screenshot or the code of the piece you love. We reply personally, with
            the details and the final price.
          </p>
          <a
            href={whatsappLink(SITE_CONFIG.whatsappNumber, "Hello M. Peters Atelier, I would like some help choosing a piece.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 flex h-14 items-center bg-stone-950 px-12 text-[10px] uppercase tracking-[0.32em] text-ivory transition-colors duration-500 hover:bg-stone-800"
          >
            Write to us on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
