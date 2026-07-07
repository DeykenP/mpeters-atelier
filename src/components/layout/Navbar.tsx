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
    <nav className={cn("hidden md:flex items-center gap-10", className)}>
      {navLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-[10px] tracking-[0.25em] uppercase text-stone-600 hover:text-stone-950 transition-colors duration-500 relative after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[1px] after:bg-stone-950 hover:after:w-full after:transition-all after:duration-500"
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
