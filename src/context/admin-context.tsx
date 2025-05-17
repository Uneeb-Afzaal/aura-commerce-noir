import React, { createContext, useContext, useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseconfig";
import { User, Product, Promotion, Order } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface AdminContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  promotions: Promotion[];
  orders: Order[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addPromotion: (promotion: Omit<Promotion, "id">) => Promise<void>;
  updatePromotion: (id: string, updates: Partial<Promotion>) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setUsers([]);
        setProducts([]);
        setPromotions([]);
        setOrders([]);
        return;
      }
      const snap = await getDoc(doc(db, "users", user.uid));
      // 1️⃣ bail if no Firebase user
    if (!user) {
        setCurrentUser(null);
        return;
      }
  
      // 2️⃣ bail if user doc doesn’t exist
      if (!snap.exists()) {
        console.error("Admin doc missing:", user.uid);
        await signOut(auth);
        return;
      }
  
      // 3️⃣ now it’s safe to read data()
      const data = snap.data() as User;
  
      // 4️⃣ bail if not an admin
      if (data.role !== "admin") {
        toast({ title: "Access denied", description: "Not an admin account.", variant: "destructive" });
        await signOut(auth);
        return;
      }
  
    
     setCurrentUser(data);
      const [usersSnap, prodSnap, promoSnap, ordersSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "products")),
        getDocs(collection(db, "promotions")),
        getDocs(collection(db, "orders")),
      ]);
      setUsers(usersSnap.docs.map(d => d.data() as User));
      setProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      setPromotions(promoSnap.docs.map(d => ({ id: d.id, ...d.data() } as Promotion)));
      setOrders(ordersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      console.log(cred);
      const snap = await getDoc(doc(db, "users", cred.user.uid));
      if (!snap.exists() || snap.data().role !== "admin") {
        toast({ title: "Access denied", description: "Not an admin account.", variant: "destructive" });
        await signOut(auth);
        return false;
      }else{
        return true;
      }
    } catch (err) {
      toast({ title: "Login failed", description: (err as Error).message, variant: "destructive" });
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    toast({ title: "Logged out" });
  };

  const addProduct = async (asset: Omit<Product, "id">) => {
    const ref = await addDoc(collection(db, "products"), asset);
    setProducts(prev => [...prev, { id: ref.id, ...asset }]);
    toast({ title: "Product added" });
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    await updateDoc(doc(db, "products", id), updates);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    toast({ title: "Product updated" });
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, "products", id));
    setProducts(prev => prev.filter(p => p.id !== id));
    toast({ title: "Product deleted" });
  };

  const addPromotion = async (asset: Omit<Promotion, "id">) => {
    const ref = await addDoc(collection(db, "promotions"), asset);
    setPromotions(prev => [...prev, { id: ref.id, ...asset }]);
    toast({ title: "Promotion added" });
  };

  const updatePromotion = async (id: string, updates: Partial<Promotion>) => {
    await updateDoc(doc(db, "promotions", id), updates);
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    toast({ title: "Promotion updated" });
  };

  const deletePromotion = async (id: string) => {
    await deleteDoc(doc(db, "promotions", id));
    setPromotions(prev => prev.filter(p => p.id !== id));
    toast({ title: "Promotion deleted" });
  };

  return <AdminContext.Provider value={{ currentUser, users, products, promotions, orders, isAuthenticated: !!currentUser, login, logout, addProduct, updateProduct, deleteProduct, addPromotion, updatePromotion, deletePromotion }}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
