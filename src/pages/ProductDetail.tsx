
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingBag, Minus, Plus, Star, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types";
import { getProductById } from "@/lib/product-service";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist();
  
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getProductById(id)
        .then((data) => {
          if (data) {
            setProduct(data);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          setIsLoading(false);
        });
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-noir-900 text-foreground flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-noir-900 text-foreground">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-3xl mb-4">Product Not Found</h1>
          <p className="mb-8">The product you are looking for doesn't exist.</p>
          <Link to="/shop">
            <Button className="bg-gold hover:bg-gold-dark text-noir-900">
              Back to Shop
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir-900 text-foreground">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm">
          <Link to="/" className="text-noir-400 hover:text-gold">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-noir-500" />
          <Link to="/shop" className="text-noir-400 hover:text-gold">Shop</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-noir-500" />
          <span className="text-foreground">{product.name}</span>
        </nav>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-noir-800 rounded-lg overflow-hidden">
              <img 
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
            </div>
          </motion.div>
          
          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-2">
              <span className="text-noir-400 text-sm">{product.brand}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < product.rating ? "fill-gold text-gold" : "text-noir-600"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-noir-300">
                ({product.rating} rating)
              </span>
            </div>
            
            {/* Price */}
            <div className="mb-8">
              <span className="text-2xl text-gold">${product.price.toFixed(2)}</span>
            </div>
            
            {/* Description */}
            <p className="text-noir-200 mb-8">
              {product.description}
            </p>
            
            {/* Stock Status */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                product.stock > 0 ? "bg-green-900/20 text-green-500" : "bg-red-900/20 text-red-500"
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </span>
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm mb-2">Quantity</label>
              <div className="flex items-center">
                <Button 
                  size="icon"
                  variant="outline"
                  className="h-10 w-10 rounded-l-md border-r-0"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <div className="h-10 px-4 flex items-center justify-center min-w-[50px] border border-input bg-background">
                  {quantity}
                </div>
                
                <Button 
                  size="icon"
                  variant="outline"
                  className="h-10 w-10 rounded-r-md border-l-0"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                className="flex-1 bg-gold hover:bg-gold-dark text-noir-900"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              
              <Button
                variant="outline"
                className={`min-w-[150px] ${
                  isInWishlist(product.id) 
                    ? "bg-gold/10 border-gold text-gold" 
                    : ""
                }`}
                onClick={handleToggleWishlist}
              >
                <Heart className={`h-4 w-4 mr-2 ${isInWishlist(product.id) ? "fill-gold" : ""}`} />
                {isInWishlist(product.id) ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Product Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details">
            <TabsList className="w-full border-b border-noir-700 bg-transparent">
              <TabsTrigger value="details" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-gold">
                Details
              </TabsTrigger>
              <TabsTrigger value="ingredients" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-gold">
                Ingredients
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-gold">
                Reviews
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="py-6">
              <div className="space-y-4">
                <p>
                  Indulge in the captivating allure of {product.name}, a fragrance that combines artistry and luxury. 
                  This exquisite perfume opens with a blend of fresh top notes that give way to a heart of rich, complex middle notes.
                </p>
                <p>
                  The base notes create a lasting impression that lingers on the skin, creating a personal signature that evolves throughout the day.
                  Crafted by master perfumers using only the finest ingredients, this fragrance is a testament to the art of perfumery.
                </p>
                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <h3 className="font-medium mb-2">Features</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-noir-200">
                      <li>Long-lasting fragrance (8-12 hours)</li>
                      <li>Made with sustainable ingredients</li>
                      <li>Cruelty-free formulation</li>
                      <li>Elegant glass bottle with gold accents</li>
                      <li>Versatile for both day and evening wear</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Specifications</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-noir-400">Volume:</span>
                      <span>50ml / 1.7 fl oz</span>
                      <span className="text-noir-400">Concentration:</span>
                      <span>Eau de Parfum</span>
                      <span className="text-noir-400">Family:</span>
                      <span>Oriental Woody</span>
                      <span className="text-noir-400">Origin:</span>
                      <span>France</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ingredients" className="py-6">
              <div className="space-y-4">
                <p>
                  Our fragrances are crafted with the finest ingredients sourced from around the world. 
                  We believe in transparency and are proud to share our formulation with our customers.
                </p>
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Ingredient List</h3>
                  <p className="text-sm text-noir-300">
                    Alcohol Denat., Parfum (Fragrance), Aqua (Water), Benzyl Salicylate, Linalool, 
                    Limonene, Coumarin, Citronellol, Geraniol, Benzyl Alcohol, Citral, Eugenol, 
                    Benzyl Benzoate, Farnesol, Isoeugenol, Cinnamal, Cinnamyl Alcohol.
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6 pt-4">
                  <div>
                    <h3 className="font-medium mb-2">Top Notes</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-noir-200">
                      <li>Bergamot</li>
                      <li>Pink Pepper</li>
                      <li>Elemi</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Heart Notes</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-noir-200">
                      <li>Black Orchid</li>
                      <li>Jasmine Absolute</li>
                      <li>Vetiver</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Base Notes</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-noir-200">
                      <li>Amber</li>
                      <li>Sandalwood</li>
                      <li>Musk</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="py-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Customer Reviews</h3>
                  <Button variant="outline">Write a Review</Button>
                </div>
                
                <div className="bg-noir-800 rounded-lg p-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <h4 className="font-medium">Amazing Fragrance!</h4>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                          ))}
                        </div>
                        <span className="text-xs text-noir-400">March 15, 2023</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-noir-400">by</span>
                      <span className="ml-1 font-medium">Emily S.</span>
                    </div>
                  </div>
                  <p className="text-sm text-noir-200">
                    This fragrance is absolutely stunning! I receive compliments every time I wear it. 
                    The longevity is impressive, lasting all day with just a few sprays. The bottle is also 
                    beautiful and looks elegant on my vanity.
                  </p>
                </div>
                
                <div className="bg-noir-800 rounded-lg p-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <h4 className="font-medium">Long-lasting and Unique</h4>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-2">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                          ))}
                          <Star className="h-3 w-3 text-noir-600" />
                        </div>
                        <span className="text-xs text-noir-400">February 28, 2023</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-noir-400">by</span>
                      <span className="ml-1 font-medium">Michael T.</span>
                    </div>
                  </div>
                  <p className="text-sm text-noir-200">
                    I'm very impressed with how long this fragrance lasts. The scent evolves beautifully 
                    throughout the day. My only critique would be that the opening is a bit strong, but it 
                    settles into a really pleasant aroma after about 30 minutes.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
