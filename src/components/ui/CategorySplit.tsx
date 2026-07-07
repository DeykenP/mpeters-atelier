"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const ease = [0.25, 0.4, 0.25, 1] as const;

const universes = [
  {
    name: "Timepieces",
    href: "/collections?category=watches",
    image: "/images/products/watches/citizen-tsuyosa-automatic-green-1.jpeg",
  },
  {
    name: "Jewelry",
    href: "/collections?category=jewelry",
    image: "/images/products/jewelry/5mm-moissanite-tennis-chain-1.jpeg",
  },
] as const;

export function CategorySplit() {
  return (
    <section className="pb-32 md:pb-44 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {universes.map((u, i) => (
            <motion.div
              key={u.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: i * 0.15, ease }}
            >
              <Link href={u.href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                  <Image
                    src={u.image}
                    alt={u.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-[1.8s] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-8 flex flex-col items-center text-center">
                  <h3 className="font-serif text-xl md:text-2xl text-stone-950 mb-3">
                    {u.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 pb-1 border-b border-transparent group-hover:border-stone-400 group-hover:text-stone-900 transition-all duration-500">
                    Discover
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
