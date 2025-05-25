
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-noir-900 border-t border-noir-700 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Logo className="mb-6" />
            <p className="text-noir-200 mb-6 text-sm">
              Discover the art of luxury fragrance with our curated collection of premium scents for the discerning individual.
            </p>
            <div className="flex space-x-4">
              {["facebook", "instagram", "twitter", "youtube"].map((social) => (
                <a
                  key={social}
                  href={`#${social}`}
                  className="h-8 w-8 rounded-full border border-noir-600 flex items-center justify-center text-noir-300 hover:border-gold hover:text-gold"
                >
                  <span className="sr-only">{social}</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-gold font-medium mb-6 uppercase text-xs tracking-widest">Shopping</h3>
            <ul className="space-y-3">
              {["All Products", "New Arrivals", "Best Sellers", "Brands", "Gift Sets"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-noir-200 hover:text-gold text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-gold font-medium mb-6 uppercase text-xs tracking-widest">Information</h3>
            <ul className="space-y-3">
              {["About Us", "Contact", "Shipping & Returns", "Privacy Policy", "Terms & Conditions"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-noir-200 hover:text-gold text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-gold font-medium mb-6 uppercase text-xs tracking-widest">Newsletter</h3>
            <p className="text-noir-200 mb-4 text-sm">
              Subscribe to our newsletter and get 10% off your first purchase.
            </p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-transparent border-noir-600 text-sm" 
              />
              <Button className="bg-gold text-noir-900 hover:bg-gold-dark hover:text-noir-900">
                Subscribe
              </Button>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-noir-300">
                <MapPin className="h-4 w-4 mr-2 text-gold" />
                <span>Sunflower Plaza 4 Johar Town</span>
              </div>
              <div className="flex items-center text-sm text-noir-300">
                <Phone className="h-4 w-4 mr-2 text-gold" />
                <span>0300 7216004</span>
              </div>
              <div className="flex items-center text-sm text-noir-300">
                <Mail className="h-4 w-4 mr-2 text-gold" />
                <span>sufianah.help@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-noir-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-noir-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Sufianah. All rights reserved.
          </p>
          {/* <div className="flex items-center space-x-4">
            <img src="/visa.svg" alt="Visa" className="h-6 opacity-60 hover:opacity-100 transition-opacity" />
            <img src="/mastercard.svg" alt="Mastercard" className="h-6 opacity-60 hover:opacity-100 transition-opacity" />
            <img src="/amex.svg" alt="American Express" className="h-6 opacity-60 hover:opacity-100 transition-opacity" />
            <img src="/paypal.svg" alt="PayPal" className="h-6 opacity-60 hover:opacity-100 transition-opacity" />
          </div> */}
        </div>
      </div>
    </footer>
  );
}
