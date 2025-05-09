
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, WishlistItem } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const { toast } = useToast();

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      try {
        setItems(JSON.parse(storedWishlist));
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage", error);
      }
    }
  }, []);

  // Save wishlist to localStorage on change
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        return prevItems;
      } else {
        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist.`,
        });
        
        return [...prevItems, product];
      }
    });
  };

  const removeItem = (id: string) => {
    const itemToRemove = items.find(item => item.id === id);
    
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    
    if (itemToRemove) {
      toast({
        title: "Removed from wishlist",
        description: `${itemToRemove.name} has been removed from your wishlist.`,
      });
    }
  };

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    setItems([]);
    toast({
      title: "Wishlist cleared",
      description: "All items have been removed from your wishlist.",
    });
  };

  const itemCount = items.length;

  const value = {
    items,
    addItem,
    removeItem,
    isInWishlist,
    clearWishlist,
    itemCount,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
