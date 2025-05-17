import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc,
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { auth, db } from "@/lib/firebaseconfig";
import { User, UserProfile, Product, Promotion, Order, Address } from "@/types";
import { useToast } from "@/components/ui/use-toast";

// Unified interface that handles both admin and user functionality
interface AppContextType {
  currentUser: UserProfile | null;
  profile: UserProfile | null; // Alias for currentUser for backward compatibility
  isAuthenticated: boolean;
  isAdmin: boolean;
  // Data
  users: UserProfile[];
  products: Product[];
  promotions: Promotion[];
  orders: Order[];
  // Auth functions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  // User functions
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addAddress: (address: Address) => Promise<void>;
  updateAddress: (index: number, address: Address) => Promise<void>;
  // Admin functions
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addPromotion: (promotion: Omit<Promotion, "id">) => Promise<void>;
  updatePromotion: (id: string, updates: Partial<Promotion>) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Reset everything when logged out
        setCurrentUser(null);
        setUsers([]);
        setProducts([]);
        setPromotions([]);
        setOrders([]);
        setIsAdmin(false);
        return;
      }

      try {
        // Get user doc
        const userSnap = await getDoc(doc(db, "users", user.uid));
        
        // Check if user doc exists
        if (!userSnap.exists()) {
          console.error("User doc missing:", user.uid);
          await signOut(auth);
          return;
        }
        
        // Get user data with role
        const userData = userSnap.data() as UserProfile;
        setCurrentUser(userData);
        
        // Check role and set admin status
        const userIsAdmin = userData.role === "admin";
        setIsAdmin(userIsAdmin);
        
        // Fetch common data for both roles
        const [prodSnap, promoSnap] = await Promise.all([
          getDocs(collection(db, "products")),
          getDocs(collection(db, "promotions")),
        ]);
        
        setProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
        setPromotions(promoSnap.docs.map(d => ({ id: d.id, ...d.data() } as Promotion)));
        
        // Fetch admin-specific data if user is admin
        if (userIsAdmin) {
          const [usersSnap, ordersSnap] = await Promise.all([
            getDocs(collection(db, "users")),
            getDocs(collection(db, "orders")),
          ]);
          setUsers(usersSnap.docs.map(d => ({ ...d.data() } as UserProfile)));
          setOrders(ordersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
        } else {
          // For regular users, only fetch their orders
          const ordersSnap = await getDocs(collection(db, "orders"));
          setOrders(ordersSnap.docs
            .map(d => ({ id: d.id, ...d.data() } as Order))
            .filter(order => order.customerId === user.uid)
          );
        }
      } catch (err) {
        console.error("Error setting up user session:", err);
        toast({ 
          title: "Session Error", 
          description: "Failed to initialize your session. Please try again.", 
          variant: "destructive" 
        });
        await signOut(auth);
      }
    });
    
    return unsubscribe;
  }, []);

  // Common auth functions
  const login = async (email: string, password: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      toast({ 
        title: "Login failed", 
        description: (err as Error).message, 
        variant: "destructive" 
      });
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    toast({ title: "Logged out" });
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const userDoc: UserProfile = { 
        id: cred.user.uid, 
        email, 
        name, 
        phone: "", 
        addresses: [], 
        profileImage: "", 
        orderHistory: [], 
        role: "customer" 
      };
      await setDoc(doc(db, "users", cred.user.uid), userDoc);
      toast({ title: "Registration successful" });
      return true;
    } catch (err) {
      toast({ 
        title: "Registration failed", 
        description: (err as Error).message, 
        variant: "destructive" 
      });
      return false;
    }
  };

  // Customer-specific functions
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    try {
      const updated = { ...currentUser, ...updates };
      await setDoc(doc(db, "users", currentUser.id), updated);
      setCurrentUser(updated);
      toast({ title: "Profile updated" });
    } catch (err) {
      toast({ 
        title: "Update failed", 
        description: (err as Error).message, 
        variant: "destructive" 
      });
    }
  };

  const addAddress = async (address: Address) => {
    if (!currentUser) return;
    try {
      const updated = { 
        ...currentUser, 
        addresses: [...currentUser.addresses, address] 
      };
      await setDoc(doc(db, "users", currentUser.id), updated);
      setCurrentUser(updated);
      toast({ title: "Address added" });
    } catch (err) {
      toast({ 
        title: "Failed to add address", 
        description: (err as Error).message, 
        variant: "destructive" 
      });
    }
  };

  const updateAddress = async (index: number, address: Address) => {
    if (!currentUser) return;
    try {
      // Make sure index is valid
      if (index < 0 || index >= currentUser.addresses.length) {
        toast({ 
          title: "Update failed", 
          description: "Invalid address index", 
          variant: "destructive" 
        });
        return;
      }
      
      // Create a new addresses array with the updated address
      const updatedAddresses = [...currentUser.addresses];
      updatedAddresses[index] = address;
      
      const updated = { 
        ...currentUser, 
        addresses: updatedAddresses
      };
      
      await setDoc(doc(db, "users", currentUser.id), updated);
      setCurrentUser(updated);
      toast({ title: "Address updated" });
    } catch (err) {
      toast({ 
        title: "Failed to update address", 
        description: (err as Error).message, 
        variant: "destructive" 
      });
    }
  };

  // Admin-specific functions with role checks
  const addProduct = async (product: Omit<Product, "id">) => {
    if (!isAdmin) {
      toast({ title: "Access denied", description: "Admin privileges required", variant: "destructive" });
      return;
    }
    try {
      const ref = await addDoc(collection(db, "products"), product);
      setProducts(prev => [...prev, { id: ref.id, ...product }]);
      toast({ title: "Product added" });
    } catch (err) {
      toast({ 
        title: "Failed to add product", 
        description: (err as Error).message, 
        variant: "destructive" 
      });
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (!isAdmin) {
      toast({ title: "Access denied", description: "Admin privileges required", variant: "destructive" });
      return;
    }
    try {
      await updateDoc(doc(db, "products", id), updates);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      toast({ title: "Product updated" });
    } catch (err) {
      toast({ 
        title: "Failed to update product", 
        description: (err as Error).message, 
        variant: "destructive" 
      });
    }
  };

  const deleteProduct = async (id: string) => {
    if (!isAdmin) {
      toast({ title: "Access denied", description: "Admin privileges required", variant: "destructive" });
      return;
    }
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({ title: "Product deleted" });
    } catch (err) {
      toast({ 
        title: "Failed to delete product", 
        description: (err as Error).message, 
        variant: "destructive" 
      });
    }
  };

  const addPromotion = async (promotion: Omit<Promotion, "id">) => {
    if (!isAdmin) {
      toast({ title: "Access denied", description: "Admin privileges required", variant: "destructive" });
      return;
    }
    try {
      const ref = await addDoc(collection(db, "promotions"), promotion);
      setPromotions(prev => [...prev, { id: ref.id, ...promotion }]);
      toast({ title: "Promotion added" });
    } catch (err) {
      toast({ 
        title: "Failed to add promotion", 
        description: (err as Error).message, 
        variant: "destructive" 
      });
    }
  };

  const updatePromotion = async (id: string, updates: Partial<Promotion>) => {
    if (!isAdmin) {
      toast({ title: "Access denied", description: "Admin privileges required", variant: "destructive" });
      return;
    }
    try {
      await updateDoc(doc(db, "promotions", id), updates);
      setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
      toast({ title: "Promotion updated" });
    } catch (err) {
      toast({ 
        title: "Failed to update promotion", 
        description: (err as Error).message, 
        variant: "destructive" 
      });
    }
  };

  const deletePromotion = async (id: string) => {
    if (!isAdmin) {
      toast({ title: "Access denied", description: "Admin privileges required", variant: "destructive" });
      return;
    }
    try {
      await deleteDoc(doc(db, "promotions", id));
      setPromotions(prev => prev.filter(p => p.id !== id));
      toast({ title: "Promotion deleted" });
    } catch (err) {
      toast({ 
        title: "Failed to delete promotion", 
        description: (err as Error).message, 
        variant: "destructive" 
      });
    }
  };

  // Provide all functions, even if some will be protected by role checks
  return (
    <AppContext.Provider 
      value={{ 
        currentUser, 
        profile: currentUser, // Alias for backward compatibility
        isAuthenticated: !!currentUser,
        isAdmin,
        users, 
        products, 
        promotions, 
        orders, 
        login, 
        logout, 
        register,
        updateProfile, 
        addAddress,
        updateAddress,
        addProduct, 
        updateProduct, 
        deleteProduct, 
        addPromotion, 
        updatePromotion, 
        deletePromotion 
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

// Convenience hooks for role-specific access
export function useUser() {
  const app = useApp();
  console.log(app);
  if(app.currentUser !== null){
  if (!app.isAuthenticated || app.isAdmin ) {
    throw new Error("useCustomer must be used with an authenticated customer");
  }
 }
  return app;
}

export function useAdmin() {
  const app = useApp();
  if(app.currentUser!== null){
  if (!app.isAuthenticated || !app.isAdmin && app.currentUser !== null) {
    throw new Error("useAdmin must be used with an authenticated admin");
  }
}
  return app;
}