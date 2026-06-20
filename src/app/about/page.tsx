import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | M. Peters Atelier",
  description: "Learn about M. Peters Atelier. We offer a carefully selected collection of luxury watches and moissanite jewelry for individuals who appreciate craftsmanship.",
};

export default function AboutPage() {
  const whatsappMessage = "Hello, I would like to speak with an atelier specialist.";
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-40 flex items-center justify-center bg-stone-50 overflow-hidden">
        <div className="container mx-auto px-4 text-center z-10 relative">
          <span className="text-[10px] tracking-[0.4em] text-stone-500 uppercase mb-8 block">
            The Atelier
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-stone-950 mb-8 max-w-4xl mx-auto leading-[1.15]">
            Curated Luxury.<br />Timeless Style.
          </h1>
          <div className="w-16 h-[1px] bg-gold-500 mx-auto mb-8" />
          <p className="text-stone-600 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed tracking-wide">
            M. Peters Atelier offers a carefully selected collection of luxury watches and moissanite jewelry for individuals who appreciate craftsmanship, quality and timeless design.
          </p>
        </div>
      </section>

      {/* 2. Our Philosophy (Editorial Style) */}
      <section className="py-24 md:py-32 container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative aspect-[3/4] bg-stone-100">
            <Image
              // Placeholder for an editorial image (e.g., watchmaking or jewelry details)
              src="https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=1000&auto=format&fit=crop"
              alt="M. Peters Philosophy"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-xs tracking-[0.3em] uppercase text-gold-600 mb-6 font-medium">Our Philosophy</h2>
            <h3 className="text-3xl md:text-4xl font-serif text-stone-950 mb-8 leading-tight">
              An Unwavering Commitment to Excellence
            </h3>
            <div className="space-y-6 text-stone-600 font-light text-sm md:text-base leading-relaxed">
              <p>
                At M. Peters Atelier, we believe that true luxury lies in the details. We prioritize quality over quantity, ensuring that every piece in our collection meets our rigorous standards for craftsmanship and aesthetic perfection.
              </p>
              <p>
                Our selection is highly curated. We do not seek to offer everything; rather, we offer only the exceptional. Whether it is the mechanical precision of a legendary timepiece or the brilliant fire of premium moissanite, we provide access to timeless elegance.
              </p>
              <p>
                Beyond the pieces themselves, we pride ourselves on personalized attention. We understand that acquiring fine jewelry or a luxury watch is an intimate experience, and we are dedicated to guiding you with absolute discretion and expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Choose M. Peters Atelier */}
      <section className="py-24 md:py-32 bg-stone-950 text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Why Choose Us</h2>
            <div className="w-12 h-[1px] bg-stone-700 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
            
            <div className="flex flex-col items-center md:items-start">
              <span className="text-gold-500 text-2xl font-serif mb-4 block">01</span>
              <h4 className="text-[11px] tracking-[0.2em] uppercase mb-4 text-white">Authentic Timepieces</h4>
              <p className="text-stone-400 text-sm font-light leading-relaxed">
                Every luxury watch is meticulously inspected for absolute authenticity and mechanical integrity.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <span className="text-gold-500 text-2xl font-serif mb-4 block">02</span>
              <h4 className="text-[11px] tracking-[0.2em] uppercase mb-4 text-white">Premium Moissanite</h4>
              <p className="text-stone-400 text-sm font-light leading-relaxed">
                We source only D-color, VVS clarity moissanite, ensuring your jewelry rivals the brilliance of natural diamonds.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <span className="text-gold-500 text-2xl font-serif mb-4 block">03</span>
              <h4 className="text-[11px] tracking-[0.2em] uppercase mb-4 text-white">Immediate Availability</h4>
              <p className="text-stone-400 text-sm font-light leading-relaxed">
                Our carefully selected inventory is physically held and ready for immediate dispatch.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <span className="text-gold-500 text-2xl font-serif mb-4 block">04</span>
              <h4 className="text-[11px] tracking-[0.2em] uppercase mb-4 text-white">Personalized Support</h4>
              <p className="text-stone-400 text-sm font-light leading-relaxed">
                Direct, discreet, and expert communication via our dedicated WhatsApp concierge service.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Call To Action */}
      <section className="py-32 md:py-48 container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-serif text-stone-950 mb-8">
          Find Your Next Signature Piece
        </h2>
        <p className="text-stone-500 max-w-xl mx-auto mb-12 text-sm font-light tracking-wide">
          Our specialists are available to assist you in discovering the perfect addition to your collection.
        </p>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="primary" size="lg">
            Contact An Atelier Specialist
          </Button>
        </a>
      </section>

    </div>
  );
}
