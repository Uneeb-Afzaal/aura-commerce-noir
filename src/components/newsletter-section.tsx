
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=80"
          alt="Background" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-noir-900/90" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-gold uppercase tracking-widest text-sm font-medium">Stay Connected</span>
            <h2 className="text-3xl md:text-4xl font-light mt-3 mb-6">
              Subscribe to our <span className="text-gold">Newsletter</span>
            </h2>
            <p className="text-noir-100 mb-8 md:text-lg">
              Be the first to know about new arrivals, exclusive offers, and fragrance insights.
              Subscribe now and receive 10% off your first order.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-noir-800/50 border-noir-700 text-foreground focus:border-gold focus:ring-gold"
              />
              <Button className="bg-gold hover:bg-gold-dark text-noir-900 px-6">
                Subscribe
              </Button>
            </div>
            
            <p className="text-noir-400 text-xs mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
