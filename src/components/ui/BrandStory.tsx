"use client";

import { motion } from "framer-motion";

export function BrandStory() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-xs uppercase tracking-[0.3em] text-gold-800 mb-6 font-medium"
        >
          Nuestra Filosofía
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-3xl md:text-4xl lg:text-5xl font-serif text-stone-950 leading-tight mb-8"
        >
          Herencia en cada detalle.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-16 h-[1px] bg-gold-500 mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-stone-600 text-sm md:text-base leading-relaxed mb-10"
        >
          Cada pieza que llevamos a la vida nace de una selección exigente de
          materiales y de manos que entienden que la elegancia no se apura.
          Trabajamos con la misma discreción con la que se conserva algo valioso:
          sin ruido, sin prisa, sin concesiones.
        </motion.p>

        <motion.a
          href="/about"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-[11px] uppercase tracking-[0.25em] text-stone-900 border-b border-stone-300 pb-1 hover:border-stone-900 transition-colors duration-300"
        >
          Conocer nuestra historia
        </motion.a>
      </div>
    </section>
  );
}
