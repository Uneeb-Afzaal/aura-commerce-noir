
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
  volume: string;
  isPackage?: boolean;
  packageImages? : [string, string, string];
  heartNotes?: [string, string, string];
  baseNotes?:  [string, string, string];
  topNotes?:   [string, string, string];
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

// New type definitions for user account features
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role : string,
  addresses: Address[];
  profileImage?: string;
  orderHistory: string[]; // Array of order IDs
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: number;
  description: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'cash_on_delivery';
  name: string; // Display name like "Visa ending in 1234"
  icon?: string;
}


export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  products: Product[];
}