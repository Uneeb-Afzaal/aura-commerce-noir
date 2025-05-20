
import { motion } from "framer-motion";
import { ProductCard } from "./ui/product-card";
import { getFeaturedProducts } from "@/lib/product-service";
import { Product } from "@/types/index";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []); // Added dependency array to prevent infinite loop

  if (isLoading) {
    return (
      <section className="py-20 bg-noir-900 relative">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-gold/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-gold rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gold/80 text-lg">Loading featured fragrances...</p>
        </div>
      </section>
    );
  }

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="py-20 bg-noir-900 relative">
        <div className="container mx-auto px-4 text-center">
          <p className="text-noir-200">No featured products available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-noir-900 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl mb-4 font-light">Our <span className="text-gold">Featured</span> Fragrances</h2>
          <p className="text-noir-200 max-w-2xl mx-auto">
            Discover our most loved scents, crafted with the finest ingredients to create an unforgettable olfactory experience.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button onClick={()=>{navigate('/shop')}} className="text-gold hover:text-gold-light border-b border-gold hover:border-gold-light pb-1 transition-colors">
            View All Products
          </button>
        </motion.div>
      </div>
    </section>
  );
}
