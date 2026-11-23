import Image from "next/image";
import Link from "next/link";

interface HeroProps {
  /** Two frames cross-fade like a slow film; a single frame simply holds. */
  frames: string[];
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  cta: { label: string; href: string };
}

export function Hero({ frames, eyebrow, headline, subheadline, cta }: HeroProps) {
  return (
    <section className="relative -mt-16 md:-mt-20 h-[100svh] min-h-[560px] w-full overflow-hidden bg-stone-950 text-ivory">
      <div className="absolute inset-0">
        {frames.map((src, i) => (
          <div key={src} className={frames.length > 1 ? "hero-frame absolute inset-0" : "absolute inset-0"}>
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              loading={i === 0 ? "eager" : undefined}
              fetchPriority={i === 0 ? "high" : undefined}
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/10 to-stone-950/35" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 pb-24 md:px-12 md:pb-28">
        {eyebrow && (
          <p className="fade-in text-[9px] uppercase tracking-[0.5em] text-ivory/70">{eyebrow}</p>
        )}
        <h1 className="fade-in mt-6 max-w-3xl font-serif text-[2.6rem] leading-[1.06] md:text-6xl lg:text-7xl">
          {headline}
        </h1>
        {subheadline && (
          <p className="fade-in-late mt-7 max-w-md text-sm font-light leading-relaxed text-ivory/75">{subheadline}</p>
        )}
        <Link
          href={cta.href}
          className="fade-in-late mt-10 self-start border-b border-ivory/40 pb-1.5 text-[10px] uppercase tracking-[0.32em] transition-colors duration-500 hover:border-ivory"
        >
          {cta.label}
        </Link>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-8 left-1/2 z-10 hidden h-12 w-px -translate-x-1/2 overflow-hidden bg-ivory/20 md:block">
        <div className="h-1/2 w-full animate-[scroll-cue_2.4s_var(--ease-film)_infinite] bg-ivory/80" />
      </div>
    </section>
  );
}
