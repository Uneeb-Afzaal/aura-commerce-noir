
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";

const Cart = () => {
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCart();
  
  // Calculate shipping cost
  const shippingCost = subtotal > 200 ? 0 : 10;
  // Calculate tax (assume 10% tax rate)
  const tax = subtotal * 0.1;
  // Calculate total cost
  const total = subtotal + shippingCost + tax;

  return (
    <div className="min-h-screen bg-noir-900 text-foreground">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-light mb-8">Your <span className="text-gold">Cart</span></h1>
          
          {items.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl mb-4">Your cart is empty</h2>
              <p className="text-noir-300 mb-8">Add some fragrances to your cart to see them here.</p>
              <Link to="/shop">
                <Button className="bg-gold hover:bg-gold-dark text-noir-900">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-noir-800 border border-noir-700 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-noir-700">
                    <h2 className="text-xl">Shopping Cart ({items.length} items)</h2>
                    <Button variant="ghost" onClick={clearCart} className="text-noir-400 hover:text-white">
                      Clear All
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex flex-col md:flex-row gap-4 pb-6 border-b border-noir-700">
                        <div className="w-full md:w-24 h-24 bg-noir-700 rounded-md overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <Link to={`/product/${item.id}`} className="text-lg font-medium hover:text-gold transition-colors">
                                {item.name}
                              </Link>
                              <p className="text-sm text-noir-300">{item.brand}</p>
                            </div>
                            <p className="text-gold">${item.price.toFixed(2)}</p>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center">
                              <Button 
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 rounded-l-md border-r-0"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              
                              <div className="h-8 px-4 flex items-center justify-center border border-input bg-background">
                                {item.quantity}
                              </div>
                              
                              <Button 
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 rounded-r-md border-l-0"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-noir-400 hover:text-white"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Link to="/shop">
                      <Button variant="link" className="text-gold">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-noir-800 border border-noir-700 rounded-lg p-6 mb-6 sticky top-24">
                  <h2 className="text-xl mb-6 pb-4 border-b border-noir-700">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shippingCost === 0 ? (
                          <span className="text-green-500">Free</span>
                        ) : (
                          `$${shippingCost.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t border-noir-700 flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-gold">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Link to="/checkout">
                    <Button className="w-full mt-6 bg-gold hover:bg-gold-dark text-noir-900">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  
                  <div className="mt-4 text-xs text-center text-noir-400">
                    Free shipping on orders over $200
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
