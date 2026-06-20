import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import { Product, Category, Collection } from "@/types";

export const ProductService = {
  /**
   * Fetch all products
   */
  async getProducts(): Promise<Product[]> {
    // Simulating network delay
    return new Promise((resolve) => setTimeout(() => resolve(products), 200));
  },

  /**
   * Fetch a single product by its slug
   */
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products.find(p => p.slug === slug));
      }, 100);
    });
  },

  /**
   * Fetch featured products for the homepage
   */
  async getFeaturedProducts(): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products.filter(p => p.featured));
      }, 150);
    });
  },

  /**
   * Fetch products by category slug
   */
  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products.filter(p => p.category === categorySlug));
      }, 200);
    });
  },

  /**
   * Fetch products by collection slug
   */
  async getProductsByCollection(collectionSlug: string): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products.filter(p => p.collection === collectionSlug));
      }, 200);
    });
  },

  /**
   * Fetch all categories
   */
  async getCategories(): Promise<Category[]> {
    return new Promise((resolve) => setTimeout(() => resolve(categories), 100));
  },

  /**
   * Fetch all collections
   */
  async getCollections(): Promise<Collection[]> {
    return new Promise((resolve) => setTimeout(() => resolve(collections), 100));
  }
};
