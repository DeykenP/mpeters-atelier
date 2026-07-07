"use client";

import { useState } from "react";
import { Product, Category } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  initialProducts: Product[];
  categories: Category[];
}

export function CollectionFilterClient({ initialProducts, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredProducts = activeCategory === "all" 
    ? initialProducts 
    : initialProducts.filter(p => p.category === activeCategory);

  return (
    <div className="w-full">
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-10 md:gap-14 mb-20 border-b border-stone-200 pb-5">
        <button 
          onClick={() => setActiveCategory("all")}
          className={`text-[11px] tracking-[0.25em] uppercase transition-colors duration-500 relative ${
            activeCategory === "all"
              ? "text-stone-950"
              : "text-stone-400 hover:text-stone-700"
          }`}
        >
          All Pieces
          {activeCategory === "all" && (
            <motion.div
              layoutId="underline"
              className="absolute left-0 right-0 -bottom-[21px] h-[1px] bg-stone-950"
            />
          )}
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={`text-[11px] tracking-[0.25em] uppercase transition-colors duration-500 relative ${
              activeCategory === cat.slug
                ? "text-stone-950"
                : "text-stone-400 hover:text-stone-700"
            }`}
          >
            {cat.name}
            {activeCategory === cat.slug && (
              <motion.div
                layoutId="underline"
                className="absolute left-0 right-0 -bottom-[21px] h-[1px] bg-stone-950"
              />
            )}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="min-h-[50vh]">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20"
            >
              {filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-64 text-center"
            >
              <h3 className="text-xl font-serif text-stone-950 mb-3">No Pieces Found</h3>
              <p className="text-stone-500 font-light text-sm">This category is currently empty.</p>
              <button
                onClick={() => setActiveCategory("all")}
                className="mt-8 text-[11px] tracking-[0.25em] uppercase text-stone-900 pb-1.5 border-b border-stone-300 hover:border-stone-900 transition-colors duration-500"
              >
                View All Pieces
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
