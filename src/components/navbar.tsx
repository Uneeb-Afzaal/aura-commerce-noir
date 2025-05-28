
import * as React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Heart , ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";

export function Navbar() {
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const { itemCount: cartItemCount } = useCart();
  const { itemCount: wishlistItemCount } = useWishlist();
  
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navbarVariants = {
    initial: {
      backgroundColor: "rgba(0, 0, 0, 0)",
      backdropFilter: "blur(0px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0)",
    },
    scrolled: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    },
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    {name: "Men" , path: "/shop?category=men"},
    {name: "Women" , path: "/shop?category=women"},
    {name: "Unisex" , path: "/shop?category=unisex"},
    { name: "Collections", path: "/collections" },
    { name: "About", path: "/about" },
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      initial="initial"
      animate={isScrolled ? "scrolled" : "initial"}
      variants={navbarVariants}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-noir-800 border-r-noir-600">
                <div className="py-6">
                  <Logo className="mb-8" />
                  <nav className="space-y-6">
                    {navLinks.map((link) => (
                      <motion.div whileHover={{ scale: 1.2, transition: { duration: 0.4 } }}>
                        <Link
                          key={link.path}
                          to={link.path}
                          className="text-sm text-foreground hover:text-gold transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-gold after:transition-all hover:after:w-full"
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
          
          <Logo />
          
          {!isMobile && (
            <nav className="hidden lg:flex items-center space-x-6">
               <motion.div whileHover={{ scale: 1.2, transition: { duration: 0.4 } }}>
              <Link to="/" className="text-sm font-bold text-foreground hover:text-gold transition-colors">
                Home
              </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.2, transition: { duration: 0.4 } }}>
              <div className="relative group">
                <button className="text-sm font-bold text-foreground hover:text-gold transition-colors flex items-center gap-1">
                  Shop
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-noir-800 rounded-md shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link 
                      to="/shop?category=men" 
                      className="block px-4 py-2 text-sm text-foreground hover:bg-noir-700 hover:text-gold"
                    >
                      For Him
                    </Link>
                    <Link 
                      to="/shop?category=women" 
                      className="block px-4 py-2 text-sm text-foreground hover:bg-noir-700 hover:text-gold"
                    >
                      For Her
                    </Link>
                    <Link 
                      to="/shop?category=unisex" 
                      className="block px-4 py-2 text-sm text-foreground hover:bg-noir-700 hover:text-gold"
                    >
                      Unisex
                    </Link>
                  </div>
                </div>
              </div>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.2, transition: { duration: 0.4 } }}>
              <Link to="/collections" className="text-sm font-bold text-foreground hover:text-gold transition-colors">
                Collections
              </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.2, transition: { duration: 0.4 } }}>
              <Link to="/about" className="text-sm font-bold text-foreground hover:text-gold transition-colors">
                About
              </Link>
              </motion.div>
            </nav>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {isSearchOpen ? (
            <div className="relative flex items-center">
              <Input
                type="search"
                placeholder="Search fragrances..."
                className="w-[200px] md:w-[300px] border-gold bg-transparent text-foreground"
                autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 text-muted-foreground"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button size="icon" variant="ghost" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <Link to="/profile">
          <Button size="icon" variant="ghost">
            <User className="h-5 w-5" />
          </Button>
          </Link>
          
          <Link to="/wishlist">
            <Button size="icon" variant="ghost" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold text-xs font-medium text-noir-900 flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </Button>
          </Link>
          
          <Link to="/cart">
            <Button size="icon" variant="ghost" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold text-xs font-medium text-noir-900 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
