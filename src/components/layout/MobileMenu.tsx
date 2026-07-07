"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Collections", href: "/collections" },
  { name: "Jewelry", href: "/collections?category=jewelry" },
  { name: "Watches", href: "/collections?category=watches" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function MobileMenu({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("md:hidden", className)}>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -ml-2 text-stone-950 hover:opacity-60 transition-opacity duration-500"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" strokeWidth={1.5} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-stone-950/40 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
              className="fixed top-0 left-0 h-full w-full max-w-sm bg-background z-50 p-8 flex flex-col"
            >
              <div className="flex justify-start mb-16">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 -ml-2 text-stone-950 hover:opacity-60 transition-opacity duration-500"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
              <nav className="flex flex-col gap-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 + 0.15, duration: 0.5 }}
                  >
                    <Link
                      href={link.href}
                      className="text-2xl font-serif tracking-wide text-stone-950 hover:opacity-60 transition-opacity duration-500 block"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
