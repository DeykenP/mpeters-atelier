import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Collections", href: "/collections" },
  { name: "Jewelry", href: "/collections?category=jewelry" },
  { name: "Watches", href: "/collections?category=watches" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar({ className }: { className?: string }) {
  return (
    <nav className={cn("hidden md:flex items-center gap-8", className)}>
      {navLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-sm tracking-widest uppercase hover:text-gold-500 transition-colors duration-300"
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
