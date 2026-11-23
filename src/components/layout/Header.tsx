"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { name: "Collection", href: "/collections" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
] as const;

/**
 * Fixed, quiet header. Over the home film it is transparent with ivory type;
 * everywhere else (and once the film is scrolled past) it settles on ivory.
 */
export function Header() {
  const pathname = usePathname();
  const overFilm = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const clear = overFilm && !scrolled;

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color] duration-700 ease-film",
        clear
          ? "bg-transparent text-ivory border-b border-transparent"
          : "bg-ivory/92 backdrop-blur-md text-stone-950 border-b border-stone-200/60"
      )}
    >
      <div className="mx-auto grid h-16 md:h-20 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-5 md:px-12">
        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.slice(0, 2).map((link) => (
            <HeaderLink key={link.href} href={link.href} active={pathname.startsWith(link.href)}>
              {link.name}
            </HeaderLink>
          ))}
        </nav>
        <div className="md:hidden">
          <MobileMenu />
        </div>

        <Link
          href="/"
          className="flex flex-col items-center leading-none transition-opacity duration-500 hover:opacity-60"
          aria-label="M. Peters Atelier — home"
        >
          <span className="font-serif text-lg md:text-[1.35rem] tracking-[0.32em] uppercase pl-[0.32em]">M. Peters</span>
          <span className="mt-1.5 text-[8px] md:text-[9px] tracking-[0.55em] uppercase opacity-60 pl-[0.55em]">Atelier</span>
        </Link>

        <nav className="flex justify-end items-center gap-10">
          <span className="hidden md:inline-flex">
            <HeaderLink href="/contact" active={pathname.startsWith("/contact")}>
              Contact
            </HeaderLink>
          </span>
        </nav>
      </div>
    </header>
  );
}

function HeaderLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative text-[10px] tracking-[0.28em] uppercase transition-opacity duration-500 hover:opacity-100",
        "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-current after:transition-all after:duration-700 after:ease-film",
        active ? "opacity-100 after:w-full" : "opacity-70 after:w-0 hover:after:w-full"
      )}
    >
      {children}
    </Link>
  );
}
