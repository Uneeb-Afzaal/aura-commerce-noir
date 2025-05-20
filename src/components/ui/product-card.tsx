import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";
import { useCart } from "@/context/cart-context";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  rating: number;
  className?: string;
}

export function ProductCard({
  id,
  name,
  brand,
  price,
  imageUrl,
  rating,
  className,
}: ProductCardProps) {
  const router = useNavigate();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const product: Product = { id, name, brand, price, imageUrl, rating };
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const product: Product = { id, name, brand, price, imageUrl, rating };
    addItem(product);
  };

  return (
    <motion.div
      onClick={() => router(`/product/${id}`)}
      className={cn(
        "group relative overflow-hidden rounded-md bg-noir-700 border border-noir-600 flex flex-col cursor-pointer",
        className
      )}
      whileHover={{ y: -5 }}
      transition={{ type: "tween", duration: 0.2 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-noir-800">
        <img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute right-2 top-2">
          <Button
            size="icon"
            variant="outline"
            className={`h-8 w-8 rounded-full bg-noir-800/50 backdrop-blur-sm hover:bg-noir-700 ${
              isInWishlist(id) ? "text-gold" : "hover:text-gold"
            }`}
            onClick={handleWishlistClick}
          >
            <Heart className={`h-4 w-4 ${isInWishlist(id) ? "fill-gold" : ""}`} />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-gold mb-1">{brand}</p>
          <h3 className="line-clamp-2 font-medium text-foreground mb-1">{name}</h3>
          <div className="flex items-center mb-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <span
                  key={i}
                  className={`text-xs ${
                    i < rating ? "text-gold" : "text-noir-400"
                  }`}
                >
                  ★
                </span>
              ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">
            PKR {price.toFixed(2)}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-9 border-gold hover:bg-gold hover:text-noir-900"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
