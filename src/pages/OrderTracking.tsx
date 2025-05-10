
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrders } from "@/context/order-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Package, Truck, CheckCircle, Clock } from "lucide-react";

interface TrackingStep {
  status: string;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  icon: React.ElementType;
}

const OrderTracking = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState(id ? getOrderById(id) : undefined);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  
  useEffect(() => {
    if (id) {
      setOrder(getOrderById(id));
    }
  }, [id, getOrderById]);
  
  useEffect(() => {
    if (order) {
      // Calculate estimated delivery date (5-7 days from order date)
      const orderDate = new Date(order.createdAt);
      const deliveryDate = new Date(orderDate);
      deliveryDate.setDate(orderDate.getDate() + 5 + Math.floor(Math.random() * 3)); // 5-7 days
      
      setEstimatedDelivery(deliveryDate.toLocaleDateString("en-US", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    }
  }, [order]);
  
  if (!order) {
    return (
      <div className="min-h-screen bg-noir-900 text-foreground">
        <Navbar />
        <main className="container mx-auto px-4 pt-32 pb-16">
          <Card className="bg-noir-800 border-noir-700">
            <CardHeader>
              <CardTitle>Order Not Found</CardTitle>
              <CardDescription>
                The order you are trying to track does not exist.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/">
                <Button className="bg-gold hover:bg-gold-dark text-noir-900">
                  Return to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Define tracking steps based on order status
  const getTrackingSteps = (): TrackingStep[] => {
    const orderPlaced = {
      status: "placed",
      title: "Order Placed",
      description: "Your order has been received and is being processed.",
      date: new Date(order.createdAt).toLocaleDateString(),
      completed: true,
      icon: Clock
    };
    
    const orderProcessing = {
      status: "processing",
      title: "Processing",
      description: "Your order is being prepared for shipping.",
      date: getStepDate(1),
      completed: ["processing", "shipped", "delivered"].includes(order.status),
      icon: Package
    };
    
    const orderShipped = {
      status: "shipped",
      title: "Shipped",
      description: "Your order is on its way to you.",
      date: getStepDate(2),
      completed: ["shipped", "delivered"].includes(order.status),
      icon: Truck
    };
    
    const orderDelivered = {
      status: "delivered",
      title: "Delivered",
      description: "Your order has been delivered.",
      date: estimatedDelivery,
      completed: order.status === "delivered",
      icon: CheckCircle
    };
    
    return [orderPlaced, orderProcessing, orderShipped, orderDelivered];
  };
  
  // Helper to calculate dates for the steps
  function getStepDate(daysToAdd: number): string {
    const date = new Date(order.createdAt);
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString();
  }
  
  const trackingSteps = getTrackingSteps();
  
  return (
    <div className="min-h-screen bg-noir-900 text-foreground">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <div className="mb-6">
          <Link to="/profile" className="text-gold hover:underline inline-flex items-center">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to profile
          </Link>
        </div>
        
        <Card className="bg-noir-800 border-noir-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-gold">Order Tracking</CardTitle>
                <CardDescription className="mt-1">
                  Track your order status and estimated delivery date
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-base font-normal capitalize">
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between gap-6">
              <div>
                <h3 className="text-sm font-medium text-noir-400 mb-1">Order Number</h3>
                <p>#{order.id.substring(6)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-noir-400 mb-1">Order Date</h3>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-noir-400 mb-1">Items</h3>
                <p>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-noir-400 mb-1">Total</h3>
                <p className="text-gold">${order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Delivery Address */}
            <div className="border border-noir-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Delivery Address</h3>
                  <p className="text-sm">{order.shippingAddress.fullName}</p>
                  <p className="text-sm">{order.shippingAddress.streetAddress}</p>
                  <p className="text-sm">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-sm">{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
            
            {/* Tracking Timeline */}
            <div>
              <h3 className="text-lg font-medium mb-4">Delivery Status</h3>
              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-4 top-0 h-full w-0.5 bg-noir-700" />
                
                {/* Steps */}
                <div className="space-y-8 relative">
                  {trackingSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`relative z-10 rounded-full p-1 ${
                        step.completed 
                          ? "bg-gold text-noir-900" 
                          : "bg-noir-700 text-noir-400"
                      }`}>
                        <step.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <h4 className={`font-medium ${
                            step.completed ? "text-white" : "text-noir-400"
                          }`}>
                            {step.title}
                          </h4>
                          <p className="text-sm text-noir-500">{step.date}</p>
                        </div>
                        <p className="text-sm text-noir-400 mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Estimated Delivery */}
            <div className="border border-noir-700 rounded-lg p-4">
              <h3 className="font-medium text-gold mb-2">Estimated Delivery</h3>
              <p>Your package should arrive by <span className="font-medium">{estimatedDelivery}</span></p>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Link to={`/order-confirmation/${order.id}`}>
                <Button variant="outline">
                  View Order Details
                </Button>
              </Link>
              <Button className="bg-gold hover:bg-gold-dark text-noir-900">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderTracking;
