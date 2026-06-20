import Link from "next/link";
import { Navbar } from "./Navbar";
import { MobileMenu } from "./MobileMenu";
import { SITE_CONFIG } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white transition-all duration-500">
      <div className="container mx-auto px-4 md:px-8 h-24 flex items-center justify-between">
        
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
          <Link href="/" className="text-xl md:text-2xl font-serif tracking-[0.25em] text-stone-950 hover:opacity-70 transition-opacity uppercase text-center">
            {SITE_CONFIG.name}
          </Link>
        </div>

        {/* Desktop Utilities Right */}
        <div className="hidden md:flex flex-1 justify-end items-center gap-8 text-stone-900">
           <span className="text-[9px] tracking-[0.2em] uppercase cursor-pointer hover:text-stone-500 transition-colors">Search</span>
           <span className="text-[9px] tracking-[0.2em] uppercase cursor-pointer hover:text-stone-500 transition-colors">Account</span>
        </div>

        {/* Mobile Spacer */}
        <div className="flex-1 flex md:hidden justify-end" />
      </div>
    </header>
  );
}
