
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, Product, Order, Promotion } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { getProducts } from "@/lib/product-service";

interface AdminContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  promotions: Promotion[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addPromotion: (promotion: Omit<Promotion, "id">) => void;
  updatePromotion: (id: string, updates: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Mock admin credentials
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on mount
  useEffect(() => {
    // Load current user
    const storedUser = localStorage.getItem("adminUser");
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse admin user from localStorage", error);
      }
    }

    // Load users
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (error) {
        console.error("Failed to parse users from localStorage", error);
      }
    } else {
      // Initialize with some mock users
      const initialUsers: User[] = [
        { id: "user1", email: "user@example.com", name: "Regular User", role: "customer" },
        { id: "admin1", email: ADMIN_EMAIL, name: "Admin User", role: "admin" }
      ];
      setUsers(initialUsers);
      localStorage.setItem("users", JSON.stringify(initialUsers));
    }

    // Load products from product service
    getProducts().then(fetchedProducts => {
      setProducts(fetchedProducts);
    });

    // Load promotions
    const storedPromotions = localStorage.getItem("promotions");
    if (storedPromotions) {
      try {
        setPromotions(JSON.parse(storedPromotions));
      } catch (error) {
        console.error("Failed to parse promotions from localStorage", error);
      }
    } else {
      // Initialize with some mock promotions
      const initialPromotions: Promotion[] = [
        { 
          id: "promo1", 
          code: "WELCOME10", 
          discountPercent: 10, 
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), 
          isActive: true 
        }
      ];
      setPromotions(initialPromotions);
      localStorage.setItem("promotions", JSON.stringify(initialPromotions));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("adminUser", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("promotions", JSON.stringify(promotions));
  }, [promotions]);

  const login = (email: string, password: string) => {
    // Simple admin authentication
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const admin = users.find(user => user.email === ADMIN_EMAIL);
      if (admin) {
        setCurrentUser(admin);
        toast({
          title: "Logged in",
          description: `Welcome back, ${admin.name}!`,
        });
        return true;
      }
    }
    
    toast({
      title: "Login failed",
      description: "Invalid email or password.",
      variant: "destructive"
    });
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("adminUser");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}`
    };
    
    setProducts(prev => [...prev, newProduct]);
    toast({
      title: "Product added",
      description: `${newProduct.name} has been added to the catalog.`,
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === id ? { ...product, ...updates } : product
      )
    );
    
    toast({
      title: "Product updated",
      description: `Product has been updated successfully.`,
    });
  };

  const deleteProduct = (id: string) => {
    const productName = products.find(p => p.id === id)?.name || "Product";
    
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    
    toast({
      title: "Product deleted",
      description: `${productName} has been removed from the catalog.`,
    });
  };

  const addPromotion = (promotion: Omit<Promotion, "id">) => {
    const newPromotion: Promotion = {
      ...promotion,
      id: `promo-${Date.now()}`
    };
    
    setPromotions(prev => [...prev, newPromotion]);
    toast({
      title: "Promotion added",
      description: `Promotion code ${newPromotion.code} has been created.`,
    });
  };

  const updatePromotion = (id: string, updates: Partial<Promotion>) => {
    setPromotions(prevPromotions => 
      prevPromotions.map(promo => 
        promo.id === id ? { ...promo, ...updates } : promo
      )
    );
    
    toast({
      title: "Promotion updated",
      description: `Promotion has been updated successfully.`,
    });
  };

  const deletePromotion = (id: string) => {
    const promoCode = promotions.find(p => p.id === id)?.code || "Promotion";
    
    setPromotions(prevPromotions => prevPromotions.filter(promo => promo.id !== id));
    
    toast({
      title: "Promotion deleted",
      description: `Promotion code ${promoCode} has been removed.`,
    });
  };

  const isAuthenticated = currentUser !== null && currentUser.role === "admin";

  const value = {
    currentUser,
    users,
    products,
    promotions,
    isAuthenticated,
    login,
    logout,
    addProduct,
    updateProduct,
    deleteProduct,
    addPromotion,
    updatePromotion,
    deletePromotion
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
