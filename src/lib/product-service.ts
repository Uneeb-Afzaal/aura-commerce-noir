import { Product } from "@/types";
import { db } from "@/lib/firebaseconfig";
import {
  collection,
  getDocs,
} from "firebase/firestore";

/**
 * In-memory cache for products to avoid redundant Firestore calls
 */
let productsCache: Product[] | null = null;

/**
 * Loads products from Firestore once and caches them
 */
const loadProducts = async (): Promise<Product[]> => {
  if (productsCache) {
    return productsCache;
  }
  const productsCol = collection(db, "products");
  const snapshot = await getDocs(productsCol);
  productsCache = snapshot.docs.map(docSnap => {
    const data = docSnap.data() as Omit<Product, 'id'>;
    return { id: docSnap.id, ...data } as Product;
  });
  return productsCache;
};

/**
 * Fetches all products (cached)
 */
export const getProducts = async (): Promise<Product[]> => {
  return loadProducts();
};

/**
 * Fetches a single product by its ID (from cache)
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  const products = await loadProducts();
  return products.find(p => p.id === id) || null;
};

/**
 * Fetches products filtered by category (from cache)
 */
export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  const products = await loadProducts();
  if (category === "all") {
    return products;
  }
  return products.filter(p => p.category === category);
};

/**
 * Fetches the first four products as featured items (from cache)
 */
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const products = await loadProducts();
  return products.slice(0, 4);
};

/**
 * Clears the product cache (for debugging or force-reload)
 */
export const clearProductCache = (): void => {
  productsCache = null;
};
