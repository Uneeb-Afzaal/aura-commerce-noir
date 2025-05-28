import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Star,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types";
import { getProductById } from "@/lib/product-service";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";

// Firebase imports
import { auth, db } from "@/lib/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

// Import Carousel components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const fallbackImage = "https://via.placeholder.com/200x200?text=Image+Not+Found";

const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageslide , setImageslide] = useState([]);
  const { addItem } = useCart();
  const {
    addItem: addToWishlist,
    isInWishlist,
    removeItem: removeFromWishlist,
  } = useWishlist();


  const [currentUser, setCurrentUser] = useState<null | { uid: string }>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState<
    { id: string; userId: string; content: string; rating: number; createdAt: any }[]
  >([]);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getProductById(id)
      .then((data) => setProduct(data || null))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (product) {
      setImageslide(product.packageImages);
      setImageslide([ product.imageUrl, ...product.packageImages ]);
    }
  },[product])


  const handleAddToCart = () => product && addItem(product, quantity);
  const handleToggleWishlist = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Track auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) =>
      setCurrentUser(user ? { uid: user.uid } : null)
    );
    return unsub;
  }, []);
  

  const onWriteReview = () =>
    currentUser ? setShowReviewForm(true) : navigate("/login");

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !id) return;
    await addDoc(collection(db, "reviews"), {
      productId: id,
      userId: currentUser.uid,
      content: reviewContent,
      rating: reviewRating,
      createdAt: serverTimestamp(),
    });
    setReviewContent("");
    setReviewRating(5);
    setShowReviewForm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-noir-900 text-foreground flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen bg-noir-900 text-foreground">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-3xl mb-4">Product Not Found</h1>
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
        <nav className="flex mb-8 text-sm">
          <Link to="/" className="text-noir-400 hover:text-gold">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-noir-500" />
          <Link to="/shop" className="text-noir-400 hover:text-gold">Shop</Link>
          <ChevronRight className="h-4 w-4 mx-2 text-noir-500" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Carousel for product images */}
            <Carousel className="w-full h-full max-w-xl mx-auto">
              <CarouselContent>
                {imageslide.map((url, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <img
                        src={url || fallbackImage}
                        onError={(e) => (e.currentTarget.src = fallbackImage)}
                        alt={`Product Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-2 text-noir-400 text-sm">{product.brand}</div>
            <h1 className="text-3xl md:text-4xl font-light mb-4">{product.name}</h1>
            <div className="flex items-center mb-6">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < product.rating ? "fill-gold text-gold" : "text-noir-600"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-noir-300">({product.rating} rating)</span>
            </div>
            <div className="mb-8 text-2xl text-gold">PKR {product.price.toFixed(2)}</div>
            <p className="text-noir-200 mb-8">{product.description}</p>
            <div className="mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? "bg-green-900/20 text-green-500" : "bg-red-900/20 text-red-500"}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </span>
            </div>
            <div className="mb-8">
              <label className="block text-sm mb-2">Quantity</label>
              <div className="flex items-center">
                <Button size="icon" variant="outline" className="h-10 w-10 rounded-l-md border-r-0" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="h-10 px-4 flex items-center justify-center min-w-[50px] border bg-noir-800">{quantity}</div>
                <Button size="icon" variant="outline" className="h-10 w-10 rounded-r-md border-l-0" onClick={() => setQuantity(quantity + 1)} disabled={quantity >= product.stock}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button className="flex-1 bg-gold hover:bg-gold-dark text-noir-900" onClick={handleAddToCart} disabled={product.stock <= 0}>
                <ShoppingBag className="h-4 w-4 mr-2" />Add to Cart
              </Button>
              <Button variant="outline" className={`min-w-[150px] ${isInWishlist(product.id) ? "bg-gold/10 border-gold text-gold" : ""}`} onClick={handleToggleWishlist}>
                <Heart className={`h-4 w-4 mr-2 ${isInWishlist(product.id) ? "fill-gold" : ""}`} />
                {isInWishlist(product.id) ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="mt-16">
          <Tabs defaultValue="details">
            <TabsList className="w-full border-b border-noir-700 bg-transparent">
              <TabsTrigger value="details" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-gold">Details</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-gold">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="py-6 space-y-4">
              <p>{product.description}</p>
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Brand:</strong> {product.brand}</p>
              <p><strong>Volume:</strong> {product.volume}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
            </TabsContent>
            <TabsContent value="reviews" className="py-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Customer Reviews</h3>
                <Button variant="outline" onClick={onWriteReview}>
                  Write a Review
                </Button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={submitReview} className="bg-noir-800 rounded-lg p-6 mb-8 space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Rating</label>
                    <select
                      aria-label="Rating"
                      value={reviewRating}
                      onChange={(e) => setReviewRating(parseInt(e.target.value, 10))}
                      className="w-24 bg-noir-800 border-noir-700 rounded p-1"
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>{r} Star{r > 1 && "s"}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Your Review</label>
                    <textarea
                      required
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      rows={4}
                      className="w-full bg-noir-800 border-noir-700 p-2 rounded"
                      placeholder="Write your thoughts…"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-gold hover:bg-gold-dark text-noir-900">
                      Submit Review
                    </Button>
                  </div>
                </form>
              )}

              {/* Existing Reviews */}
              <div className="space-y-6">
                {reviews.length === 0 && (
                  <p className="text-noir-400">No reviews yet.</p>
                )}
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-noir-800 rounded-lg p-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < rev.rating ? "fill-gold text-gold" : "text-noir-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-noir-400">
                        {rev.createdAt?.toDate().toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-noir-200">{rev.content}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PackageDetail;