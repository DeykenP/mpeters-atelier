"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface HeroProps {
  headline: string;
  subheadline?: string;
  cta: { label: string; href: string };
  backgroundImage?: string;
  /** Optional looping ambient video; backgroundImage becomes its poster. */
  backgroundVideo?: string;
  className?: string;
}

const ease = [0.25, 0.4, 0.25, 1] as const;

export function Hero({
  headline,
  subheadline,
  cta,
  backgroundImage,
  backgroundVideo,
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative w-full h-[92vh] min-h-[600px] flex items-end overflow-hidden bg-stone-950",
        className
      )}
    >
      {/* Background: video > image > branded gradient */}
      {backgroundVideo ? (
        <video
          className="absolute inset-0 z-0 w-full h-full object-cover opacity-90"
          src={backgroundVideo}
          poster={backgroundImage}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : backgroundImage ? (
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: "easeOut" }}
        >
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            className="object-cover object-center opacity-90"
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.08),_transparent_65%)]" />
        </div>
      )}

      {/* Single legibility gradient anchored to the text zone */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 z-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />

      {/* Content: bottom-left, editorial */}
      <div className="container relative z-10 mx-auto px-6 md:px-12 pb-24 md:pb-32">
        <motion.h1
          className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory tracking-wide max-w-2xl leading-[1.15] mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease }}
        >
          {headline}
        </motion.h1>

        {subheadline && (
          <motion.p
            className="text-sm text-ivory/70 max-w-md mb-10 font-light leading-relaxed tracking-wide"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.4, ease }}
          >
            {subheadline}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.6, ease }}
        >
          <Link
            href={cta.href}
            className="inline-block text-[11px] uppercase tracking-[0.3em] text-ivory pb-1.5 border-b border-ivory/40 hover:border-ivory transition-colors duration-500"
          >
            {cta.label}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
