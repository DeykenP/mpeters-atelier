import type { Metadata } from "next";
import { ViewTransition } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Vercel provides the production domain at build time; used for share images
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"
  ),
  title: {
    default: "M. Peters Atelier — Fine Jewelry, Made to Order",
    template: "%s | M. Peters Atelier",
  },
  description:
    "Chains, bracelets, rings, earrings and pendants in moissanite, sterling silver and gold finishes — made to order by M. Peters Atelier.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased font-sans min-h-screen flex flex-col`}>
        <Header />
        {/* Every route change dissolves the page content (see globals.css) */}
        <ViewTransition update="dissolve" default="none">
          <main className="flex-grow flex flex-col pt-16 md:pt-20">{children}</main>
        </ViewTransition>
        <Footer />
      </body>
    </html>
  );
}
