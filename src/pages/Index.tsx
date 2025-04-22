
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturedProducts } from "@/components/featured-products";
import { CategoriesSection } from "@/components/categories-section";
import { NewsletterSection } from "@/components/newsletter-section";
import { Footer } from "@/components/footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-noir-900 text-foreground">
      <Navbar />
      
      <main>
        <HeroSection />
        
        {/* Luxury Story Section */}
        <section className="py-20 bg-noir-800">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1595425970377-c9393ee12689?auto=format&fit=crop&w=800&q=80" 
                  alt="Luxury Fragrance" 
                  className="rounded-lg shadow-2xl"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span className="text-gold uppercase tracking-widest text-sm font-medium">Our Story</span>
                <h2 className="text-3xl md:text-4xl font-light mt-3 mb-6">
                  The Art of <span className="text-gold">Fragrance</span>
                </h2>
                <p className="text-noir-100 mb-6">
                  At AURA NOIR, we believe fragrance is more than just a scent; it's an expression of individuality and a powerful trigger of memories and emotions.
                </p>
                <p className="text-noir-200 mb-8">
                  Our master perfumers blend rare and precious ingredients from around the world to create unique compositions that evolve with your personal chemistry, resulting in a truly individual olfactory signature.
                </p>
                <button className="text-gold hover:text-gold-light border-b border-gold hover:border-gold-light pb-1 transition-colors">
                  Discover Our Craftsmanship
                </button>
              </motion.div>
            </div>
          </div>
        </section>
        
        <FeaturedProducts />
        <CategoriesSection />
        
        {/* Testimonials Section */}
        <section className="py-20 bg-noir-900">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl mb-4 font-light">What Our <span className="text-gold">Clients</span> Say</h2>
              <p className="text-noir-200 max-w-2xl mx-auto">
                Discover what makes our fragrances exceptional through the experiences of our clients.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item, index) => (
                <motion.div
                  key={item}
                  className="bg-noir-800 rounded-lg p-8 border border-noir-700 relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="absolute -top-5 left-8 bg-gold text-noir-900 w-10 h-10 flex items-center justify-center rounded-full">
                    "
                  </div>
                  <p className="text-noir-100 mb-6 mt-3">
                    "The fragrances from AURA NOIR are truly exceptional. The attention to detail in each composition is remarkable, creating scents that are both memorable and uniquely sophisticated."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-noir-600 rounded-full mr-3"></div>
                    <div>
                      <h4 className="font-medium">Alex Thompson</h4>
                      <p className="text-sm text-noir-300">Loyal Customer</p>
                    </div>
                  </div>
                  <div className="flex mt-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-gold">★</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <NewsletterSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
