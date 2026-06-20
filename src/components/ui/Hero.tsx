"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "./Button";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
    <section className={cn("relative w-full h-[95vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-stone-950", className)}>
      {/* Background Image with Parallax subtle scale */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <Image 
          src={backgroundImage}
          alt="M. Peters Atelier"
          fill
          priority
          className="object-cover object-center opacity-80"
        />
        {/* Elegant Dark Overlay */}
        <div className="absolute inset-0 bg-stone-950/30 bg-gradient-to-t from-stone-950/60 via-transparent to-stone-950/30" />
      </motion.div>

      <div className="container relative z-10 mx-auto px-4 text-center flex flex-col items-center pt-16">
        <motion.span 
          className="text-[9px] md:text-[10px] tracking-[0.4em] text-white/80 uppercase mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
        >
          The New Standard
        </motion.span>
        
        <motion.h1 
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-white tracking-wide max-w-5xl mb-8 leading-[1.1] drop-shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {headline}
        </motion.h1>
        
        <motion.p 
          className="text-xs md:text-sm text-white/90 max-w-xl mb-12 font-light leading-relaxed tracking-[0.05em] drop-shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {subheadline}
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 sm:gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <Link href={primaryCta.href}>
            <Button size="lg" className="w-full sm:w-auto bg-white text-stone-950 hover:bg-stone-200 border-none">
              {primaryCta.label}
            </Button>
          </Link>
          
          {secondaryCta && (
            <Link href={secondaryCta.href}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/40 text-white hover:bg-white hover:text-stone-950 hover:border-white">
                {secondaryCta.label}
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
