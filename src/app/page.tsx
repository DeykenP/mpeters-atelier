import { Hero } from "@/components/ui/Hero";
import { BrandStory } from "@/components/ui/BrandStory";
import { CategorySplit } from "@/components/ui/CategorySplit";

export default function Home() {
  return (
    <>
      <Hero
        headline="Timeless luxury, modern craftsmanship."
        cta={{ label: "Discover the Collections", href: "/collections" }}
        backgroundImage="/images/hero/home-hero.png"
      />
      <BrandStory />
      <CategorySplit />
    </>
  );
}
