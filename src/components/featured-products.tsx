
import { motion } from "framer-motion";
import { ProductCard } from "./ui/product-card";

// Mock data for featured products
const featuredProducts = [
  {
    id: "1",
    name: "Oud Noir Intense",
    brand: "AURA",
    price: 215,
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyZnVtZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    rating: 5
  },
  {
    id: "2",
    name: "Ambre Éternel",
    brand: "Exclusive",
    price: 175,
    imageUrl: "https://images.unsplash.com/photo-1557170334-a9086426b0c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGVyZnVtZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    rating: 4
  },
  {
    id: "3",
    name: "Velvet Rose & Gold",
    brand: "AURA",
    price: 195,
    imageUrl: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGVyZnVtZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    rating: 5
  },
  {
    id: "4",
    name: "Bois de Santal",
    brand: "Luxury",
    price: 230,
    imageUrl: "https://images.unsplash.com/photo-1595425970377-c9393ee12689?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cGVyZnVtZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    rating: 4
  }
];

export function FeaturedProducts() {
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
          <button className="text-gold hover:text-gold-light border-b border-gold hover:border-gold-light pb-1 transition-colors">
            View All Products
          </button>
        </motion.div>
      </div>
    </section>
  );
}
