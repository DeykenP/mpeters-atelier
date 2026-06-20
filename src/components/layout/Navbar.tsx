import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Collections", href: "/collections" },
  { name: "Jewelry", href: "/collections?category=jewelry" },
  { name: "Watches", href: "/collections?category=watches" },
  { name: "About", href: "/about" },
];

export function Navbar({ className }: { className?: string }) {
  return (
    <nav className={cn("hidden md:flex items-center gap-8", className)}>
      {navLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-[9px] tracking-[0.2em] uppercase text-stone-900 hover:text-stone-400 transition-colors duration-300 relative after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[1px] after:bg-stone-300 hover:after:w-full after:transition-all after:duration-500"
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
