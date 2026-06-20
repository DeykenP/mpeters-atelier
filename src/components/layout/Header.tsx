import Link from "next/link";
import { Navbar } from "./Navbar";
import { MobileMenu } from "./MobileMenu";
import { SITE_CONFIG } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* Mobile Menu (Left on mobile, hidden on desktop) */}
        <div className="flex-1 md:hidden">
          <MobileMenu />
        </div>

        {/* Logo (Centered on mobile, left on desktop) */}
        <div className="flex-1 md:flex-none flex justify-center md:justify-start">
          <Link href="/" className="text-2xl font-serif tracking-widest text-foreground hover:opacity-80 transition-opacity">
            {SITE_CONFIG.name}
          </Link>
        </div>

        {/* Desktop Navigation (Hidden on mobile, right on desktop) */}
        <div className="hidden md:flex flex-1 justify-end">
          <Navbar />
        </div>

        {/* Spacer for mobile to balance the flex layout */}
        <div className="flex-1 md:hidden" />
      </div>
    </header>
  );
}
