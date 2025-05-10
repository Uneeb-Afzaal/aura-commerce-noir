
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

export interface OrderItem extends CartItem {}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: Address;
  paymentMethod: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'returned';

export interface Address {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  orders?: string[]; // Order IDs
}

export type UserRole = 'customer' | 'admin';

export interface Promotion {
  id: string;
  code: string;
  discountPercent: number;
  validUntil: string;
  isActive: boolean;
}
