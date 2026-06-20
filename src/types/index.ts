export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Collection {
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

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string; // references Category slug
  collection?: string; // references Collection slug
  description: string;
  shortDescription: string;
  images: string[];
  featuredImage: string;
  price: number;
  featured: boolean;
  specifications: ProductSpecification[];
}
