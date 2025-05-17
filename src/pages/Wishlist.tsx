
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Heart } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";

const Wishlist = () => {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  
  return (
    <div className="min-h-screen bg-noir-900 text-foreground">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-light mb-8">Your <span className="text-gold">Wishlist</span></h1>
          
          {items.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl mb-4">Your wishlist is empty</h2>
              <p className="text-noir-300 mb-8">Add some fragrances to your wishlist to see them here.</p>
              <Link to="/shop">
                <Button className="bg-gold hover:bg-gold-dark text-noir-900">
                  Explore Fragrances
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              <div className="bg-noir-800 border border-noir-700 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-noir-700">
                  <h2 className="text-xl">Saved Items ({items.length})</h2>
                  <Button variant="ghost" onClick={clearWishlist} className="text-noir-400 hover:text-white">
                    Clear All
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <div key={item.id} className="bg-noir-700 rounded-lg overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name}
                          className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="absolute top-2 right-2 bg-noir-900/50 hover:bg-noir-800 text-white"
                          onClick={() => removeItem(item.id)}
                        >
                          <Heart className="h-4 w-4 fill-gold" />
                        </Button>
                      </div>
                      
                      <div className="p-4">
                        <Link to={`/product/${item.id}`} className="font-medium hover:text-gold transition-colors block">
                          {item.name}
                        </Link>
                        <p className="text-sm text-noir-300">{item.brand}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-gold">PKR {item.price.toFixed(2)}</span>
                          <Button 
                            size="sm"
                            onClick={() => {
                              addItem(item);
                              removeItem(item.id);
                            }}
                            className="bg-gold hover:bg-gold-dark text-noir-900"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
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

export default Wishlist;
