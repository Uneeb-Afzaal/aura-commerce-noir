import { Collection, Product } from "@/types";
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

export const getProductsByCollection = async (): Promise<Collection[]> => {
  const products = await loadProducts();

  // 1. Find all "package" products (i.e., collections)
  const collectionProducts = products.filter(p => p.isPackage && Array.isArray(p.packageImages));

  // 2. For each package‐product, build a Collection entry
  const collections: Collection[] = collectionProducts.map(pkg => {
    // a. Filter out non‐package products whose name matches any of pkg.packageImages
    const matchedProducts = products.filter(p => {
      if (p.isPackage) return false;

      // Check if any image in this package maps (via extractProductName → normalizeName) to p.name
      return pkg.packageImages!.some(imgUrl => {
        const extracted = extractProductName(imgUrl);      // e.g. "blue desert"
        return normalizeName(extracted) === normalizeName(p.name);
      });
    });

    return {
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      image: pkg.imageUrl,
      products: matchedProducts,
    };
  });

  return collections;
};

function extractProductName(url: string) {
  // 1. Grab everything after the last '/'
  const segments = url.split('/');
  let filename = segments[segments.length - 1];             // e.g. "bluedesert1.png"

  // 2. Remove the extension (".png" or ".jpg", etc.)
  filename = filename.replace(/\.[^/.]+$/, '');             // "bluedesert1"

  // 3. Strip any trailing digits
  filename = filename.replace(/\d+$/, '');                   // "bluedesert"

  // 4. If it already contains hyphens or underscores, turn them into spaces:
  if (/[-_]/.test(filename)) {
    filename = filename.replace(/[-_]/g, ' ');               // e.g. "blue-desert" → "blue desert"
  }
  // 5. Else if it contains a camelCase boundary, insert a space before each uppercase:
  else if (/[a-z][A-Z]/.test(filename)) {
    filename = filename.replace(/([a-z])([A-Z])/g, '$1 $2'); // e.g. "BlueDesert" → "Blue Desert"
  }
  // 6. Otherwise (all‐lowercase, no delimiter), split it in half:
  else {
    const mid = Math.floor(filename.length / 2);
    filename = filename.slice(0, mid) + ' ' + filename.slice(mid);
  }

  // 7. Finally, collapse multiple spaces and lowercase everything
  return filename.trim().replace(/\s+/g, ' ').toLowerCase();
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '');
}
