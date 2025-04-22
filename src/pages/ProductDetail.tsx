
import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Minus, Plus, Share2, ShoppingCart, Star, Truck } from "lucide-react";

// Mock product data
const product = {
  id: "1",
  name: "Oud Noir Intense",
  brand: "AURA",
  price: 215,
  description: "An intense and captivating fragrance that combines rare oud wood with spicy notes of cardamom and saffron. The heart reveals a bouquet of Bulgarian rose and geranium, while the base notes of amber, sandalwood, and vanilla create a warm, lingering finish.",
  rating: 4.8,
  reviews: 124,
  images: [
    "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1595425970377-c9393ee12689?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=800&q=80"
  ],
  details: {
    concentration: "Eau de Parfum",
    size: "100ml",
    topNotes: "Cardamom, Saffron, Bergamot",
    heartNotes: "Bulgarian Rose, Geranium, Jasmine",
    baseNotes: "Oud Wood, Amber, Sandalwood, Vanilla",
    longevity: "Long-lasting (8-10 hours)",
    sillage: "Strong",
  },
  inStock: true
};

// Mock reviews
const reviews = [
  {
    id: "r1",
    author: "James Wilson",
    date: "March 15, 2023",
    rating: 5,
    content: "This is the most sophisticated fragrance I've ever owned. The oud and saffron combination is divine, and the longevity is exceptional. Worth every penny."
  },
  {
    id: "r2",
    author: "Sophia Martinez",
    date: "February 28, 2023",
    rating: 4,
    content: "Beautiful fragrance with excellent projection and longevity. The only reason I'm giving it 4 stars instead of 5 is that it's quite intense for everyday wear."
  },
  {
    id: "r3",
    author: "Michael Thompson",
    date: "January 12, 2023",
    rating: 5,
    content: "This has become my signature scent. I receive compliments every time I wear it. The dry down is absolutely stunning."
  }
];

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="min-h-screen bg-noir-900 text-foreground">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div>
              <motion.div 
                className="aspect-square overflow-hidden bg-noir-800 rounded-lg mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <div className="flex gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`w-24 h-24 rounded-md overflow-hidden bg-noir-800 ${
                      selectedImage === index
                        ? "ring-2 ring-gold"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-1">
                <h2 className="text-sm uppercase tracking-wider text-gold mb-2">
                  {product.brand}
                </h2>
                <h1 className="text-3xl md:text-4xl font-light mb-2">{product.name}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-2">
                    {Array(5).fill(0).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-gold fill-gold"
                            : "text-noir-500"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-noir-200">{product.rating} ({product.reviews} reviews)</span>
                </div>
                
                <div className="text-2xl mb-6">${product.price.toFixed(2)}</div>
                
                <p className="text-noir-100 mb-8">{product.description}</p>
                
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-noir-200">Availability:</span>
                    <span className={product.inStock ? "text-green-500" : "text-red-500"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 mb-6">
                    <div className="flex items-center border border-noir-700 rounded-md">
                      <button
                        onClick={decreaseQuantity}
                        className="px-3 py-2 hover:bg-noir-800 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 border-x border-noir-700 min-w-[50px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={increaseQuantity}
                        className="px-3 py-2 hover:bg-noir-800 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <Button className="bg-gold hover:bg-gold-dark text-noir-900 flex-grow px-8">
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                    
                    <Button variant="outline" size="icon" className="border-noir-700 hover:bg-noir-800">
                      <Heart className="h-5 w-5" />
                    </Button>
                    
                    <Button variant="outline" size="icon" className="border-noir-700 hover:bg-noir-800">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-noir-700">
                  <div className="flex items-center text-sm">
                    <Truck className="h-4 w-4 mr-2 text-gold" />
                    <span>Free shipping on orders over $100</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 mr-2 text-gold" />
                    <span>Earn loyalty points with every purchase</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Product Details Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full bg-noir-800 border-b border-noir-700 p-0 mb-8 rounded-none space-x-6">
                <TabsTrigger 
                  value="details" 
                  className="py-4 data-[state=active]:border-b-2 data-[state=active]:border-gold data-[state=active]:text-gold rounded-none"
                >
                  Product Details
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="py-4 data-[state=active]:border-b-2 data-[state=active]:border-gold data-[state=active]:text-gold rounded-none"
                >
                  Reviews ({reviews.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="shipping" 
                  className="py-4 data-[state=active]:border-b-2 data-[state=active]:border-gold data-[state=active]:text-gold rounded-none"
                >
                  Shipping & Returns
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl mb-4 font-light">Fragrance Details</h3>
                    <table className="w-full text-sm">
                      <tbody>
                        <tr>
                          <td className="py-2 text-noir-300">Concentration</td>
                          <td>{product.details.concentration}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-noir-300">Size</td>
                          <td>{product.details.size}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-noir-300">Top Notes</td>
                          <td>{product.details.topNotes}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-noir-300">Heart Notes</td>
                          <td>{product.details.heartNotes}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-noir-300">Base Notes</td>
                          <td>{product.details.baseNotes}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-noir-300">Longevity</td>
                          <td>{product.details.longevity}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-noir-300">Sillage</td>
                          <td>{product.details.sillage}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h3 className="text-xl mb-4 font-light">The Experience</h3>
                    <p className="text-noir-100 mb-4">
                      Oud Noir Intense is a bold yet sophisticated fragrance that begins with an enticing blend of spices. The opening notes of cardamom and saffron create an immediate warmth that's complemented by a hint of fresh bergamot.
                    </p>
                    <p className="text-noir-100 mb-4">
                      As the fragrance evolves, the heart notes of Bulgarian rose and jasmine emerge, adding a sumptuous floral dimension without ever becoming overpowering. The geranium adds a subtle green facet that bridges the gap between the spicy opening and the rich base.
                    </p>
                    <p className="text-noir-100">
                      The true character of this composition reveals itself in the base, where precious oud wood is enhanced by creamy sandalwood, sweet vanilla, and amber. This combination creates a long-lasting trail that's both mysterious and inviting.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-0">
                <div className="mb-8 pb-8 border-b border-noir-700">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="md:w-1/3">
                      <div className="text-center md:text-left">
                        <div className="text-4xl font-light mb-2">{product.rating}</div>
                        <div className="flex items-center justify-center md:justify-start mb-2">
                          {Array(5).fill(0).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(product.rating)
                                  ? "text-gold fill-gold"
                                  : "text-noir-500"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-noir-200">Based on {product.reviews} reviews</p>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3">
                      <Button className="w-full md:w-auto bg-gold hover:bg-gold-dark text-noir-900">
                        Write a Review
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {reviews.map((review) => (
                    <div key={review.id} className="pb-8 border-b border-noir-700">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{review.author}</h4>
                        <span className="text-sm text-noir-300">{review.date}</span>
                      </div>
                      <div className="flex mb-3">
                        {Array(5).fill(0).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-gold fill-gold"
                                : "text-noir-500"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-noir-100">{review.content}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl mb-4 font-light">Shipping Information</h3>
                    <p className="text-noir-100 mb-4">
                      We offer the following shipping options for all orders:
                    </p>
                    <ul className="space-y-3 text-noir-100">
                      <li className="flex items-start">
                        <span className="text-gold mr-2">•</span>
                        <div>
                          <span className="font-medium">Standard Shipping (3-5 business days):</span> Free on orders over $100, $10 for orders under $100
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold mr-2">•</span>
                        <div>
                          <span className="font-medium">Express Shipping (1-2 business days):</span> $20
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold mr-2">•</span>
                        <div>
                          <span className="font-medium">Next Day Delivery:</span> Available for orders placed before 2pm
                        </div>
                      </li>
                    </ul>
                    <p className="text-noir-300 text-sm mt-4">
                      Please note that delivery times are estimates and may vary depending on your location.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl mb-4 font-light">Returns & Refunds</h3>
                    <p className="text-noir-100 mb-4">
                      We want you to be completely satisfied with your purchase. If for any reason you are not, we offer a simple returns process:
                    </p>
                    <ul className="space-y-3 text-noir-100">
                      <li className="flex items-start">
                        <span className="text-gold mr-2">•</span>
                        <div>
                          Return unused and unopened products within 30 days of delivery for a full refund
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold mr-2">•</span>
                        <div>
                          Contact our customer service team to initiate a return
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-gold mr-2">•</span>
                        <div>
                          Refunds will be processed within 5-7 business days after we receive your return
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
