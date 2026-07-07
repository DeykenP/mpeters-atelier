import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | M. Peters Atelier",
  description: "Learn about M. Peters Atelier. A carefully selected collection of luxury watches and moissanite jewelry for individuals who appreciate craftsmanship.",
};

const pillars = [
  {
    title: "Authentic Timepieces",
    body: "Every watch is meticulously inspected for absolute authenticity and mechanical integrity.",
  },
  {
    title: "Premium Moissanite",
    body: "Only D-color, VVS clarity stones — brilliance that rivals natural diamonds.",
  },
  {
    title: "Personal Attention",
    body: "Direct, discreet and expert guidance through our dedicated concierge service.",
  },
] as const;

export default function AboutPage() {
  const whatsappMessage = "Hello, I would like to speak with an atelier specialist.";
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="bg-background min-h-screen">

      {/* 1. Editorial Opening */}
      <section className="py-28 md:py-40">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <span className="text-[10px] tracking-[0.4em] text-stone-500 uppercase mb-10 block">
            The Atelier
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-950 mb-10 max-w-3xl mx-auto leading-[1.15]">
            Curated luxury.<br />Timeless style.
          </h1>
          <p className="text-stone-600 max-w-xl mx-auto text-sm md:text-base font-light leading-loose tracking-wide">
            M. Peters Atelier offers a carefully selected collection of luxury
            watches and moissanite jewelry for individuals who appreciate
            craftsmanship, quality and timeless design.
          </p>
        </div>
      </section>

      {/* 2. Philosophy — editorial split */}
      <section className="pb-28 md:pb-40 container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 lg:gap-24 items-center">
          <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
            <Image
              src="/images/products/watches/citizen-tsuyosa-automatic-tiffany-1.jpeg"
              alt="A timepiece from the M. Peters Atelier collection"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] tracking-[0.4em] uppercase text-stone-500 mb-8">Our Philosophy</span>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-950 mb-10 leading-snug">
              An unwavering commitment to excellence.
            </h2>
            <div className="space-y-6 text-stone-600 font-light text-sm leading-loose">
              <p>
                True luxury lies in the details. We prioritize quality over
                quantity, ensuring every piece in our collection meets rigorous
                standards for craftsmanship and aesthetic perfection.
              </p>
              <p>
                Our selection is deliberately narrow. We do not seek to offer
                everything — only the exceptional. Whether the mechanical
                precision of a fine timepiece or the fire of premium
                moissanite, we provide access to the timeless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pillars */}
      <section className="py-28 md:py-40 bg-stone-950">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="flex flex-col items-center text-center">
                <h3 className="text-[11px] tracking-[0.3em] uppercase mb-6 text-ivory">
                  {pillar.title}
                </h3>
                <div className="w-8 h-[1px] bg-gold-700 mb-6" />
                <p className="text-stone-400 text-sm font-light leading-loose max-w-xs">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Call To Action */}
      <section className="py-32 md:py-44 container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-stone-950 mb-8">
          Find your signature piece.
        </h2>
        <p className="text-stone-500 max-w-md mx-auto mb-14 text-sm font-light tracking-wide leading-relaxed">
          Our specialists are available to guide you with absolute discretion.
        </p>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="lg">
            Contact a Specialist
          </Button>
        </a>
      </section>

    </div>
  );
}
