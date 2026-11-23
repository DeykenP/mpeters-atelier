export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

/** A selectable variant axis, e.g. { name: "Length", values: ['18"', '20"', '22"'] } */
export interface ProductOption {
  name: string;
  values: string[];
}

/** One orderable combination, with its own catalog code and price. */
export interface ProductVariant {
  sku: string;
  price: number;
  options: Record<string, string>;
  image?: string;
}

/** "light" photos sit on a studio-white background; "dark" ones fill their frame. */
export type ImageTone = "light" | "dark";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string; // references Category slug
  material?: string;
  /** Catalog series, e.g. "Stainless Steel Rope Chain - 18K Series" */
  section?: string;
  /** Catalog reference, e.g. "MPAT-0014" */
  reference?: string;
  description: string;
  shortDescription: string;
  images: string[];
  featuredImage: string;
  imageTones?: Record<string, ImageTone>;
  /** Lowest price; priceMax is set when variants differ in price */
  price: number;
  priceMax?: number;
  colors?: string[];
  featured: boolean;
  /** Made to order from the catalog (vs. pieces held in stock) */
  madeToOrder?: boolean;
  specifications: ProductSpecification[];
  features?: string[];
  options?: ProductOption[];
  variants?: ProductVariant[];
}

/** The light-weight shape sent to product grids on the client. */
export interface ProductSummary {
  slug: string;
  name: string;
  category: string;
  material?: string;
  reference?: string;
  price: number;
  priceMax?: number;
  image: string;
  tone: ImageTone;
  colors: string[];
  search: string;
}
