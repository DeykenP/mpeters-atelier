/**
 * Product catalog: pieces held in stock (src/data/products.ts) plus the
 * made-to-order catalog generated from the M. Peters PDF catalogs
 * (src/data/catalog.json, see tools/catalog-extractor).
 *
 * Server-side only: client components receive ProductSummary objects.
 */
import raw from "@/data/catalog.json";
import { products as stockProducts } from "@/data/products";
import { categories } from "@/data/categories";
import type { Category, ImageTone, Product, ProductSummary } from "@/types";

interface CatalogFile {
  images: Record<string, { w: number; h: number; tone: ImageTone }>;
  products: {
    slug: string;
    name: string;
    category: string;
    material: string;
    section: string;
    reference: string;
    colors: string[];
    price: number;
    priceMax: number;
    images: string[];
    options: { name: string; values: string[] }[];
    variants: { sku: string; price: number; options: Record<string, string>; image: string | null }[];
    specifications: { name: string; value: string }[];
    features: string[];
  }[];
}

const data = raw as unknown as CatalogFile;
const src = (file: string) => `/catalog/${file}`;

const catalogProducts: Product[] = data.products.map((p, i) => ({
  id: `mpat_${i + 1}`,
  slug: p.slug,
  name: p.name,
  category: p.category,
  material: p.material,
  section: p.section || undefined,
  reference: p.reference,
  description: "",
  shortDescription: "",
  images: p.images.map(src),
  featuredImage: p.images[0] ? src(p.images[0]) : "",
  imageTones: Object.fromEntries(p.images.map((f) => [src(f), data.images[f]?.tone ?? "light"])),
  price: p.price,
  priceMax: p.priceMax > p.price ? p.priceMax : undefined,
  colors: p.colors,
  featured: false,
  madeToOrder: true,
  specifications: p.specifications,
  features: p.features,
  options: p.options,
  variants: p.variants.map((v) => ({
    sku: v.sku,
    price: v.price,
    options: v.options,
    image: v.image ? src(v.image) : undefined,
  })),
}));

export const allProducts: Product[] = [...stockProducts, ...catalogProducts];

const bySlug = new Map(allProducts.map((p) => [p.slug, p]));

export function getProduct(slug: string): Product | undefined {
  return bySlug.get(slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function productsIn(category?: string): Product[] {
  return category ? allProducts.filter((p) => p.category === category) : allProducts;
}

/**
 * Listing order: studio-photographed catalog pieces before snapshots of
 * stock pieces, and — for the whole collection — the categories in turn, so
 * the first rows show a necklace, a ring, earrings… rather than 70 chains.
 */
export function listingOrder(category?: string): Product[] {
  const studioFirst = (items: Product[]) => [
    ...items.filter((p) => p.madeToOrder),
    ...items.filter((p) => !p.madeToOrder),
  ];
  if (category) return studioFirst(productsIn(category));
  const lanes = categories.map((c) => studioFirst(productsIn(c.slug)));
  const out: Product[] = [];
  for (let i = 0; out.length < allProducts.length; i++) {
    let added = false;
    for (const lane of lanes) {
      if (lane[i]) {
        out.push(lane[i]);
        added = true;
      }
    }
    if (!added) break;
  }
  return out;
}

export function toneOf(product: Product, image = product.featuredImage): ImageTone {
  return product.imageTones?.[image] ?? "dark";
}

export function toSummary(p: Product): ProductSummary {
  return {
    slug: p.slug,
    name: p.name,
    category: p.category,
    material: p.material,
    reference: p.reference,
    price: p.price,
    priceMax: p.priceMax,
    image: p.featuredImage,
    tone: toneOf(p),
    colors: p.colors ?? [],
    search: [p.name, p.section, p.material, p.reference, p.category].filter(Boolean).join(" ").toLowerCase(),
  };
}

/** Categories that have pieces, with a representative photo for each. */
export function collectionIndex(): (Category & { count: number; image: string; tone: ImageTone })[] {
  return categories
    .map((c) => {
      const items = productsIn(c.slug);
      const cover = pickShowcase(items, 1)[0] ?? items[0];
      return { ...c, count: items.length, image: cover?.featuredImage ?? "", tone: cover ? toneOf(cover) : "dark" };
    })
    .filter((c) => c.count > 0);
}

/**
 * A handful of pieces that photograph well: studio-white photos, several
 * options, moissanite or gold first. Deterministic, so pages stay stable.
 */
export function pickShowcase(items: Product[], n: number): Product[] {
  const score = (p: Product) =>
    (toneOf(p) === "light" ? 4 : 0) +
    (p.material === "moissanite" ? 2 : 0) +
    Math.min(3, (p.options?.length ?? 0)) +
    (p.images.length > 1 ? 1 : 0) -
    (p.madeToOrder ? 0 : 1);
  return [...items]
    .map((p, i) => ({ p, s: score(p) - i * 0.0001 }))
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map((x) => x.p);
}

/** Home page selection: the best pieces of each category, in turn. */
export function featuredProducts(n = 8): Product[] {
  const order = ["necklaces", "rings", "earrings", "bracelets", "pendants"];
  const pools = order.map((c) => pickShowcase(productsIn(c), n));
  const picked: Product[] = [];
  for (let round = 0; picked.length < n && round < n; round++) {
    for (const pool of pools) {
      if (pool[round] && picked.length < n) picked.push(pool[round]);
    }
  }
  return picked;
}

/** Same series first, then the same category. */
export function relatedTo(product: Product, n = 4): Product[] {
  const others = productsIn(product.category).filter((p) => p.slug !== product.slug);
  const sameSection = product.section ? others.filter((p) => p.section === product.section) : [];
  const rest = others.filter((p) => !sameSection.includes(p));
  return [...pickShowcase(sameSection, n), ...pickShowcase(rest, n)].slice(0, n);
}

