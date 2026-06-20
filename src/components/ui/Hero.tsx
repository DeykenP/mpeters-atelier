"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface HeroProps {
  headline: string;
  subheadline: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  backgroundImage: string;
  className?: string;
}

export function Hero({
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  backgroundImage,
  className,
}: HeroProps) {
  return (
    <section className={cn("relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden", className)}>
      {/* Background Image with Parallax subtle scale */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        {/* Elegant Dark Overlay */}
        <div className="absolute inset-0 bg-stone-950/40 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
      </motion.div>

      <div className="container relative z-10 mx-auto px-4 text-center flex flex-col items-center">
        <motion.h1 
          className="font-serif text-4xl md:text-6xl lg:text-7xl text-white tracking-wide max-w-4xl mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {headline}
        </motion.h1>
        
        <motion.p 
          className="text-base md:text-lg text-stone-200 max-w-2xl mb-10 font-light leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {subheadline}
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <Link href={primaryCta.href}>
            <Button size="lg" className="w-full sm:w-auto">
              {primaryCta.label}
            </Button>
          </Link>
          
          {secondaryCta && (
            <Link href={secondaryCta.href}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                {secondaryCta.label}
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
