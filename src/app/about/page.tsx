import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { whatsappLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "M. Peters Atelier makes fine jewelry to order: moissanite, sterling silver and gold finishes, confirmed with you personally.",
};

const steps = [
  {
    title: "Choose",
    body: "Browse the collection and pick the finish, the width and the length that suit you.",
  },
  {
    title: "Write to us",
    body: "Send the code or a screenshot by WhatsApp. We confirm the details and the final price.",
  },
  {
    title: "Made for you",
    body: "Your piece is made to order, exactly as you chose it.",
  },
] as const;

const materials = [
  { title: "Moissanite", body: "D colour, VVS clarity stones with a fire that rivals diamond." },
  { title: "Sterling silver", body: "S925 silver, finished in white, yellow or rose gold." },
  { title: "Stainless steel", body: "Steel chains in 14K and 18K gold tones, made for every day." },
] as const;

export default function AboutPage() {
  return (
    <div className="pb-28 md:pb-40">
      <section className="mx-auto max-w-3xl px-6 pt-20 text-center md:pt-32">
        <p className="text-[9px] uppercase tracking-[0.5em] text-stone-400">The Atelier</p>
        <h1 className="mt-8 font-serif text-4xl leading-[1.1] text-stone-950 md:text-6xl">
          Made to order,
          <br />
          made to last.
        </h1>
        <p className="mx-auto mt-10 max-w-xl text-sm font-light leading-loose text-stone-600 md:text-base">
          M. Peters Atelier makes fine jewelry to order — chains, bracelets, rings, earrings and
          pendants in moissanite, sterling silver and gold finishes — alongside a small selection
          of automatic watches.
        </p>
      </section>

      <section className="mx-auto mt-24 w-full max-w-[1600px] px-6 md:mt-36 md:px-12">
        <div className="reveal relative aspect-[16/9] overflow-hidden bg-stone-900 md:aspect-[21/9]">
          <Image src="/images/hero/collections-hero.png" alt="" fill sizes="100vw" className="object-cover" />
        </div>
      </section>

      <section className="mx-auto mt-24 grid w-full max-w-[1600px] gap-14 px-6 md:mt-36 md:grid-cols-3 md:gap-12 md:px-12">
        {steps.map((s, i) => (
          <div key={s.title} className="reveal">
            <p className="text-[10px] tracking-[0.3em] text-stone-400">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="mt-5 font-serif text-2xl text-stone-950">{s.title}</h2>
            <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-stone-600">{s.body}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-28 w-full max-w-[1600px] border-t border-stone-200 px-6 pt-20 md:mt-40 md:px-12 md:pt-28">
        <h2 className="text-center font-serif text-3xl text-stone-950 md:text-4xl">The materials</h2>
        <div className="mt-16 grid gap-14 text-center md:grid-cols-3 md:gap-12">
          {materials.map((m) => (
            <div key={m.title} className="reveal flex flex-col items-center">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-stone-950">{m.title}</h3>
              <div className="my-6 h-px w-8 bg-gold-700" />
              <p className="max-w-xs text-sm font-light leading-relaxed text-stone-600">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-28 flex max-w-xl flex-col items-center px-6 text-center md:mt-40">
        <h2 className="font-serif text-3xl text-stone-950 md:text-4xl">Find your piece.</h2>
        <div className="mt-12 flex flex-col items-center gap-8 sm:flex-row">
          <Link
            href="/collections"
            className="flex h-14 items-center bg-stone-950 px-12 text-[10px] uppercase tracking-[0.32em] text-ivory transition-colors duration-500 hover:bg-stone-800"
          >
            The collection
          </Link>
          <a
            href={whatsappLink(SITE_CONFIG.whatsappNumber, "Hello M. Peters Atelier, I would like some help choosing a piece.")}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-stone-300 pb-1 text-[10px] uppercase tracking-[0.32em] text-stone-900 transition-colors duration-500 hover:border-stone-900"
          >
            WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
