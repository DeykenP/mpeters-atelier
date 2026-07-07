import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | M. Peters Atelier",
  description: "Speak directly with an atelier specialist. Private consultations by appointment.",
};

export default function ContactPage() {
  const whatsappMessage = "Hello, I would like to speak with an atelier specialist.";
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="bg-background min-h-screen">
      <section className="py-32 md:py-48">
        <div className="container mx-auto px-6 md:px-12 max-w-2xl text-center flex flex-col items-center">
          <span className="text-[10px] tracking-[0.4em] text-stone-500 uppercase mb-10 block">
            Contact
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-950 mb-10 leading-tight">
            At your service.
          </h1>
          <p className="text-stone-600 text-sm md:text-base font-light leading-loose tracking-wide mb-16 max-w-lg">
            Every inquiry is handled personally and in complete confidence.
            Reach us directly — our specialists respond promptly.
          </p>

          <div className="flex flex-col items-center gap-10 mb-20">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg">
                Message us on WhatsApp
              </Button>
            </a>
            <a
              href="mailto:contact@mpetersatelier.com"
              className="text-[11px] uppercase tracking-[0.3em] text-stone-900 pb-1.5 border-b border-stone-300 hover:border-stone-900 transition-colors duration-500"
            >
              contact@mpetersatelier.com
            </a>
          </div>

          <div className="w-10 h-[1px] bg-stone-300 mb-10" />

          <p className="text-[10px] uppercase tracking-[0.25em] text-stone-400 leading-loose">
            Private consultations by appointment
          </p>
        </div>
      </section>
    </div>
  );
}
