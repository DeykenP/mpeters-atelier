"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const ease = [0.25, 0.4, 0.25, 1] as const;

export function BrandStory() {
  return (
    <section className="py-32 md:py-44 bg-background">
      <div className="container mx-auto px-6 md:px-12 max-w-2xl text-center flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease }}
          className="text-[10px] uppercase tracking-[0.4em] text-stone-500 mb-8"
        >
          The Atelier
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="text-3xl md:text-4xl font-serif text-stone-950 leading-snug mb-10"
        >
          Heritage in every detail.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
          className="text-stone-600 text-sm md:text-base font-light leading-loose mb-12"
        >
          Each piece we bring to life is born of an exacting selection of
          materials, and of hands that understand elegance is never rushed.
          We work with the same discretion with which one keeps something
          precious — without noise, without haste, without compromise.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Link
            href="/about"
            className="inline-block text-[11px] uppercase tracking-[0.3em] text-stone-900 pb-1.5 border-b border-stone-300 hover:border-stone-900 transition-colors duration-500"
          >
            Our Story
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
