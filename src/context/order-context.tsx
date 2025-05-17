import React, { createContext, useContext, useState, useEffect } from "react";
import { Order, OrderStatus, CartItem, Address } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { db, auth } from "@/lib/firebaseconfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

interface OrderContextType {
  orders: Order[];
  createOrder: (items: CartItem[], address: Address, paymentMethod: string) => Promise<Order | null>;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  initiateReturn: (id: string) => Promise<void>;
  reorder: (orderId: string) => CartItem[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }
    // Subscribe to Firestore orders for this user
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("customerId", "==", currentUser.uid));
    const unsubscribe = onSnapshot(q, snapshot => {
      const fetched: Order[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Order, 'id'>),
      }));
      setOrders(fetched);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const createOrder = async (
    items: CartItem[],
    address: Address,
    paymentMethod: string
  ): Promise<Order | null> => {
    if (!currentUser) return null;
    const newOrder = {
      customerId: currentUser.uid,
      items,
      totalAmount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: "pending" as OrderStatus,
      createdAt: serverTimestamp(),
      shippingAddress: address,
      paymentMethod,
    };
    try {
      const docRef = await addDoc(collection(db, "orders"), newOrder);
      const savedOrder: Order = {
        id: docRef.id,
        ...newOrder,
        createdAt: new Date().toISOString()
      } as unknown as Order;
      toast({
        title: "Order created",
        description: `Order #${docRef.id} has been created successfully.`,
      });
      return savedOrder;
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      const orderDoc = doc(db, "orders", id);
      await updateDoc(orderDoc, { status });
      toast({
        title: "Order updated",
        description: `Order #${id} status changed to ${status}.`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    }
  };

  const initiateReturn = async (id: string) => {
    await updateOrderStatus(id, "returned");
    toast({
      title: "Return initiated",
      description: `Return for order #${id} has been initiated.`,
    });
  };

  const reorder = (orderId: string) => {
    const order = getOrderById(orderId);
    if (!order) return [];
    toast({
      title: "Items added to cart",
      description: `${order.items.length} items from your previous order have been added to your cart.`,
    });
    return order.items;
  };

  const value: OrderContextType = {
    orders,
    createOrder,
    getOrderById,
    updateOrderStatus,
    initiateReturn,
    reorder,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
