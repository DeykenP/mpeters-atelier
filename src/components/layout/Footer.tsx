"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 text-stone-300 py-16 md:py-24 border-t border-stone-800">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h2 className="text-3xl font-serif text-white tracking-wider">{SITE_CONFIG.name}</h2>
            <p className="text-sm leading-relaxed max-w-md">
              Discover unparalleled craftsmanship and timeless elegance. Subscribe to our exclusive newsletter to receive early access to new collections and bespoke services.
            </p>
            <form className="flex mt-2 max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent border-b border-stone-600 px-0 py-2 w-full text-white placeholder-stone-500 focus:outline-none focus:border-gold-500 transition-colors"
                required
              />
              <button
                type="submit"
                className="ml-4 text-sm tracking-widest uppercase hover:text-gold-500 transition-colors duration-300 flex items-center"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Customer Service */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-sm font-semibold tracking-widest uppercase mb-2">Services</h3>
            <Link href="/contact" className="text-sm hover:text-gold-500 transition-colors">Contact Us</Link>
            <Link href="/faq" className="text-sm hover:text-gold-500 transition-colors">FAQ</Link>
            <Link href="/bespoke" className="text-sm hover:text-gold-500 transition-colors">Bespoke Jewelry</Link>
            <Link href="/care" className="text-sm hover:text-gold-500 transition-colors">Care & Maintenance</Link>
          </div>

          {/* Legal & Social */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white text-sm font-semibold tracking-widest uppercase mb-2">Legal</h3>
            <Link href="/terms" className="text-sm hover:text-gold-500 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-sm hover:text-gold-500 transition-colors">Privacy Policy</Link>
            
            <div className="mt-6 flex items-center gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors" aria-label="Instagram">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors" aria-label="Facebook">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-500 transition-colors" aria-label="Twitter">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="mailto:contact@mpetersatelier.com" className="hover:text-gold-500 transition-colors" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <p>&copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.</p>
          <p>Exclusively for connoisseurs of fine jewelry and watches.</p>
        </div>
      </div>
    </footer>
  );
}
