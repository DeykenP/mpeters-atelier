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
      <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-16 border-b border-stone-200 pb-4">
        <button 
          onClick={() => setActiveCategory("all")}
          className={`text-xs md:text-sm tracking-[0.2em] uppercase transition-colors duration-300 relative ${
            activeCategory === "all" 
              ? "text-stone-900" 
              : "text-stone-400 hover:text-stone-600"
          }`}
        >
          All Pieces
          {activeCategory === "all" && (
            <motion.div 
              layoutId="underline"
              className="absolute left-0 right-0 -bottom-[17px] h-[2px] bg-stone-900" 
            />
          )}
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.slug)}
            className={`text-xs md:text-sm tracking-[0.2em] uppercase transition-colors duration-300 relative ${
              activeCategory === cat.slug 
                ? "text-stone-900" 
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            {cat.name}
            {activeCategory === cat.slug && (
              <motion.div 
                layoutId="underline"
                className="absolute left-0 right-0 -bottom-[17px] h-[2px] bg-stone-900" 
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
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
              <h3 className="text-xl font-serif text-stone-900 mb-2">No Pieces Found</h3>
              <p className="text-stone-500 font-light">We couldn't find any items in this category at the moment.</p>
              <button 
                onClick={() => setActiveCategory("all")}
                className="mt-6 text-xs tracking-widest uppercase text-gold-600 hover:text-gold-700 transition-colors"
              >
                View All Collections
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
