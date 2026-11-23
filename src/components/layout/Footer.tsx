import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { categories } from "@/data/categories";

export function Footer() {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}`;

  return (
    <footer className="border-t border-stone-200/70 bg-background">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-20 md:py-28">
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex flex-col leading-none">
              <span className="font-serif text-xl tracking-[0.32em] uppercase">M. Peters</span>
              <span className="mt-2 text-[9px] tracking-[0.55em] uppercase text-stone-500">Atelier</span>
            </Link>
            <p className="mt-8 max-w-xs text-xs font-light leading-relaxed text-stone-500">
              Fine jewelry, made to order. Prices in USD, subject to confirmation.
            </p>
          </div>

          <FooterColumn title="Collection">
            {categories.map((c) => (
              <FooterLink key={c.slug} href={`/collections/${c.slug}`}>
                {c.name}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Atelier">
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterColumn>

          <FooterColumn title="Enquiries">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              WhatsApp
            </a>
            <a href="mailto:contact@mpetersatelier.com" className={linkClass}>
              Email
            </a>
          </FooterColumn>
        </div>

        <p className="mt-20 text-[9px] uppercase tracking-[0.3em] text-stone-400">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}
        </p>
      </div>
    </footer>
  );
}

const linkClass =
  "text-[11px] tracking-[0.12em] text-stone-600 transition-colors duration-500 hover:text-stone-950";

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-6 text-[9px] uppercase tracking-[0.35em] text-stone-400">{title}</h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={linkClass}>
      {children}
    </Link>
  );
}
