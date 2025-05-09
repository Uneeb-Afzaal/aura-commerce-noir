
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  rating: number;
  description?: string;
  category?: string;
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem extends Product {}
