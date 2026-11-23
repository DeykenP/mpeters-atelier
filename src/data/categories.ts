import { Category } from "@/types";

/** Display order of the collection. */
export const categories: Category[] = [
  {
    id: "cat_necklaces",
    name: "Necklaces",
    slug: "necklaces",
    description: "Rope, Cuban, tennis and pearl — chains in every width and length.",
  },
  {
    id: "cat_bracelets",
    name: "Bracelets",
    slug: "bracelets",
    description: "Tennis lines, Cuban links and quiet everyday bracelets.",
  },
  {
    id: "cat_rings",
    name: "Rings",
    slug: "rings",
    description: "Moissanite solitaires, bands and statement rings in sterling silver.",
  },
  {
    id: "cat_earrings",
    name: "Earrings",
    slug: "earrings",
    description: "Studs, hoops and huggies, from a single stone to full pavé.",
  },
  {
    id: "cat_pendants",
    name: "Pendants",
    slug: "pendants",
    description: "Crosses, medallions and pendants with their chain.",
  },
  {
    id: "cat_anklets",
    name: "Anklets",
    slug: "anklets",
    description: "Fine chains for the ankle, adjustable in length.",
  },
  {
    id: "cat_watches",
    name: "Watches",
    slug: "watches",
    description: "Automatic timepieces, available now.",
  },
];

export const MATERIALS: Record<string, string> = {
  moissanite: "Moissanite",
  "sterling-silver": "Sterling Silver",
  "stainless-steel": "Stainless Steel",
  brass: "Brass & Zirconia",
};
