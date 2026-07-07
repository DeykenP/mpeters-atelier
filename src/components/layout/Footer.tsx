import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

const footerLinks = [
  { name: "Collections", href: "/collections" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}`;

  return (
    <footer className="bg-stone-950 text-stone-400 py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-12 flex flex-col items-center text-center">
        <h2 className="text-xl md:text-2xl font-serif text-ivory tracking-[0.3em] uppercase mb-10">
          {SITE_CONFIG.name}
        </h2>

        <nav className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[10px] uppercase tracking-[0.25em] text-stone-400 hover:text-ivory transition-colors duration-500"
            >
              {link.name}
            </Link>
          ))}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-[0.25em] text-stone-400 hover:text-ivory transition-colors duration-500"
          >
            WhatsApp
          </a>
          <a
            href="mailto:contact@mpetersatelier.com"
            className="text-[10px] uppercase tracking-[0.25em] text-stone-400 hover:text-ivory transition-colors duration-500"
          >
            Email
          </a>
        </nav>

        <div className="w-10 h-[1px] bg-stone-800 mb-12" />

        <p className="text-[10px] tracking-[0.15em] text-stone-600 uppercase">
          &copy; {currentYear} {SITE_CONFIG.name}
        </p>
      </div>
    </footer>
  );
}
