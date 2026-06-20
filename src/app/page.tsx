import { Hero } from "@/components/ui/Hero";
import { FeaturedProducts } from "@/components/product/FeaturedProducts";
import { SITE_CONFIG } from "@/lib/constants";

export default function Home() {
  return (
    <>
      <Hero 
        headline="Timeless Luxury. Modern Craftsmanship."
        subheadline="Discover exceptional watches and jewelry curated for those who appreciate excellence."
        primaryCta={{ label: "Explore Collections", href: "/collections" }}
        secondaryCta={{ label: "Contact via WhatsApp", href: `https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}` }}
        backgroundImage="/images/hero/home-hero.jpg"
      />
      <FeaturedProducts />
    </>
  );
}
