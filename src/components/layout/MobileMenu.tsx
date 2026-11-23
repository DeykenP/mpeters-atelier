"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/data/categories";

const ease = [0.22, 1, 0.36, 1] as const;

const LINKS = [
  { name: "The Collection", href: "/collections" },
  ...categories.map((c) => ({ name: c.name, href: `/collections/${c.slug}` })),
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="-ml-2 flex h-10 w-10 flex-col items-start justify-center gap-[5px] pl-2"
        aria-label="Open menu"
      >
        <span className="block h-px w-6 bg-current" />
        <span className="block h-px w-4 bg-current" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ivory text-stone-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="flex h-16 items-center justify-between px-5">
              <span className="text-[9px] tracking-[0.5em] uppercase text-stone-500">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="relative h-10 w-10"
                aria-label="Close menu"
              >
                <span className="absolute left-2 top-1/2 h-px w-6 rotate-45 bg-current" />
                <span className="absolute left-2 top-1/2 h-px w-6 -rotate-45 bg-current" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-5 px-8 pb-16">
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.7, ease }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={
                      i === 0 || i > categories.length
                        ? "block font-serif text-3xl tracking-wide"
                        : "block pl-1 text-[11px] uppercase tracking-[0.3em] text-stone-500"
                    }
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
