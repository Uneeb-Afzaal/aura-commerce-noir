import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseconfig";
import { UserProfile, Address, Order, Product, Promotion } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface UserContextType {
  isAuthenticated: boolean;
  profile: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addAddress: (address: Address) => Promise<void>;
  orders: Order[];
  products: Product[];
  promotions: Promotion[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setProfile(null);
        setOrders([]);
        setProducts([]);
        setPromotions([]);
        return;
      }
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!user) {
        setProfile(null);
        return;
      }
  
      // 2️⃣ bail if user doc doesn’t exist
      if (!snap.exists()) {
        console.error("Customer doc missing:", user.uid);
        await signOut(auth);
        return;
      }
  
      // 3️⃣ safe to read
      const data = snap.data() as UserProfile;
  
      // 4️⃣ bail if not a customer
      if (data.role !== "customer") {
        toast({ title: "Access denied", description: "Not a customer account.", variant: "destructive" });
        await signOut(auth);
        return;
      }
  
      // 5️⃣ success!
      setProfile(data);
      setProfile(snap.data() as UserProfile);
      // Fetch collections
      const [ordersSnap, prodSnap, promoSnap] = await Promise.all([
        getDocs(collection(db, "orders")),
        getDocs(collection(db, "products")),
        getDocs(collection(db, "promotions")),
      ]);
      setOrders(ordersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      setProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      setPromotions(promoSnap.docs.map(d => ({ id: d.id, ...d.data() } as Promotion)));
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log(password);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user?.emailVerified ?? true;
    } catch (err) {
      toast({ title: "Login failed", description: (err as Error).message, variant: "destructive" });
      return false;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const userDoc: UserProfile = { id: cred.user.uid, email, name, phone: "", addresses: [], profileImage: "", orderHistory: [], role: "customer" };
      await setDoc(doc(db, "users", cred.user.uid), userDoc);
      setProfile(userDoc);
      console.log(password)
      toast({ title: "Registration successful" });
      return true;
    } catch (err) {
      toast({ title: "Registration failed", description: (err as Error).message, variant: "destructive" });
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    toast({ title: "Logged out" });
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const updated = { ...profile, ...updates };
    await setDoc(doc(db, "users", profile.id), updated);
    setProfile(updated);
    toast({ title: "Profile updated" });
  };

  const addAddress = async (address: Address) => {
    if (!profile) return;
    const updated = { ...profile, addresses: [...profile.addresses, address] };
    await setDoc(doc(db, "users", profile.id), updated);
    setProfile(updated);
    toast({ title: "Address added" });
  };

  return <UserContext.Provider value={{ isAuthenticated: !!profile, profile, login, logout, register, updateProfile, addAddress, orders, products, promotions }}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}

