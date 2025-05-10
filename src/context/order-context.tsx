
import React, { createContext, useContext, useState, useEffect } from "react";
import { Order, OrderStatus, CartItem, Address } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface OrderContextType {
  orders: Order[];
  createOrder: (items: CartItem[], address: Address, paymentMethod: string) => Order;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  initiateReturn: (id: string) => void;
  reorder: (orderId: string) => CartItem[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();

  // Load orders from localStorage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch (error) {
        console.error("Failed to parse orders from localStorage", error);
      }
    }
  }, []);

  // Save orders to localStorage on change
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const createOrder = (items: CartItem[], address: Address, paymentMethod: string) => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      customerId: "current-user", // In a real app, this would be the authenticated user's ID
      items,
      totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: "pending",
      createdAt: new Date().toISOString(),
      shippingAddress: address,
      paymentMethod
    };

    setOrders(prevOrders => [...prevOrders, newOrder]);
    
    toast({
      title: "Order created",
      description: `Order #${newOrder.id.substring(6)} has been created successfully.`,
    });
    
    return newOrder;
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, status } : order
      )
    );
    
    toast({
      title: "Order updated",
      description: `Order #${id.substring(6)} status changed to ${status}.`,
    });
  };

  const initiateReturn = (id: string) => {
    updateOrderStatus(id, "returned");
    
    toast({
      title: "Return initiated",
      description: `Return for order #${id.substring(6)} has been initiated.`,
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

  const value = {
    orders,
    createOrder,
    getOrderById,
    updateOrderStatus,
    initiateReturn,
    reorder
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
