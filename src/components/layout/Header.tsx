import Link from "next/link";
import { Navbar } from "./Navbar";
import { MobileMenu } from "./MobileMenu";
import { SITE_CONFIG } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-stone-200/70">
      <div className="container mx-auto px-6 md:px-12 h-20 md:h-24 flex items-center justify-between">
        {/* Mobile Menu (Left on mobile) */}
        <div className="flex-1 flex md:hidden justify-start">
          <MobileMenu />
        </div>

        {/* Desktop Nav Left */}
        <div className="hidden md:flex flex-1 justify-start">
          <Navbar />
        </div>

        {/* Logo (Centered) */}
        <div className="flex-1 flex justify-center">
          <Link
            href="/"
            className="text-lg md:text-xl font-serif tracking-[0.3em] text-stone-950 hover:opacity-60 transition-opacity duration-500 uppercase text-center whitespace-nowrap"
          >
            {SITE_CONFIG.name}
          </Link>
        </div>

        {/* Right spacer (keeps logo centered) */}
        <div className="flex-1 flex justify-end">
          <Link
            href="/contact"
            className="hidden md:inline-block text-[10px] tracking-[0.25em] uppercase text-stone-500 hover:text-stone-950 transition-colors duration-500"
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}
