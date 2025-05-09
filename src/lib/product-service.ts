
import { Product } from "@/types";

// Mock product data
const products: Product[] = [
  {
    id: "1",
    name: "Oud Noir Intense",
    brand: "AURA",
    price: 215,
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=60",
    rating: 5,
    description: "A rich, woody fragrance with deep notes of oud, leather, and amber. Perfect for evening wear and special occasions.",
    category: "men",
    stock: 15
  },
  {
    id: "2",
    name: "Ambre Éternel",
    brand: "Exclusive",
    price: 175,
    imageUrl: "https://images.unsplash.com/photo-1557170334-a9086426b0c2?auto=format&fit=crop&w=500&q=60",
    rating: 4,
    description: "A warm, sensual amber fragrance with notes of vanilla, benzoin, and labdanum. Long-lasting and perfect for cold weather.",
    category: "unisex",
    stock: 8
  },
  {
    id: "3",
    name: "Velvet Rose & Gold",
    brand: "AURA",
    price: 195,
    imageUrl: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=500&q=60",
    rating: 5,
    description: "A luxurious floral fragrance featuring Bulgarian rose, peony, and a touch of gold accord. Elegant and sophisticated.",
    category: "women",
    stock: 12
  },
  {
    id: "4",
    name: "Bois de Santal",
    brand: "Luxury",
    price: 230,
    imageUrl: "https://images.unsplash.com/photo-1595425970377-c9393ee12689?auto=format&fit=crop&w=500&q=60",
    rating: 4,
    description: "A sophisticated sandalwood fragrance with notes of cedarwood, vetiver, and musk. Timeless and refined.",
    category: "men",
    stock: 7
  },
  {
    id: "5",
    name: "Midnight Orchid",
    brand: "AURA",
    price: 185,
    imageUrl: "https://images.unsplash.com/photo-1615341805327-154891803c7f?auto=format&fit=crop&w=500&q=60",
    rating: 5,
    description: "A mysterious floral fragrance with black orchid, dark berries, and patchouli. Perfect for evening glamour.",
    category: "women",
    stock: 10
  },
  {
    id: "6",
    name: "Vetiver & Amber",
    brand: "Premium",
    price: 165,
    imageUrl: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&w=500&q=60",
    rating: 4,
    description: "A fresh yet warm fragrance with vetiver, amber, and citrus notes. Versatile for both day and evening wear.",
    category: "unisex",
    stock: 14
  },
  {
    id: "7",
    name: "Saffron Oud",
    brand: "Luxury",
    price: 260,
    imageUrl: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=500&q=60",
    rating: 5,
    description: "An opulent oriental fragrance with precious saffron, oud wood, and rose. A statement scent for special occasions.",
    category: "unisex",
    stock: 5
  },
  {
    id: "8",
    name: "Noir Absolu",
    brand: "AURA",
    price: 210,
    imageUrl: "https://images.unsplash.com/photo-1559783510-c056abca0733?auto=format&fit=crop&w=500&q=60",
    rating: 4,
    description: "An intense black vanilla fragrance with notes of tobacco, leather, and tonka bean. Bold and unforgettable.",
    category: "men",
    stock: 9
  },
];

export const getProducts = () => {
  return Promise.resolve(products);
};

export const getProductById = (id: string) => {
  const product = products.find(product => product.id === id);
  return Promise.resolve(product);
};

export const getProductsByCategory = (category: string) => {
  if (category === "all") return Promise.resolve(products);
  const filteredProducts = products.filter(product => product.category === category);
  return Promise.resolve(filteredProducts);
};
