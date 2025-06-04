
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import collection1 from "@/assets/images/col1.png";
import {getProductsByCollection} from "@/lib/product-service";
import { Collection } from "@/types";
import suf from "@/assets/images/suf.png";

const Collections = () => {
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [loading, setLoading] = React.useState(true);
  // Collection categories
  // const collections = [
  //   {
  //     id: "signature",
  //     name: "Signature Collection",
  //     description: "Our most iconic fragrances that define luxury and sophistication.",
  //     image: collection1,
  //     products: [
  //       { id: "sig1", name: "Midnight Amber", description: "Deep woody notes with amber and musk", price: 185 },
  //       { id: "sig2", name: "Golden Elixir", description: "A rich blend of vanilla and sandalwood", price: 195 },
  //       { id: "sig3", name: "Azure Sky", description: "Fresh citrus notes with a hint of sea breeze", price: 175 },
  //       { id: "sig4", name: "Royal Oud", description: "Luxurious oud with subtle spicy undertones", price: 210 },
  //     ]
  //   },
  //   {
  //     id: "limited",
  //     name: "Limited Edition",
  //     description: "Exclusive fragrances created for special occasions and seasons.",
  //     image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80",
  //     products: [
  //       { id: "ltd1", name: "Winter Frost", description: "Pine and cedarwood with spicy cinnamon", price: 220 },
  //       { id: "ltd2", name: "Summer Breeze", description: "Coconut and tropical flowers", price: 190 },
  //       { id: "ltd3", name: "Autumn Spice", description: "Warm spices with vanilla and amber", price: 205 },
  //       { id: "ltd4", name: "Spring Bloom", description: "Fresh floral bouquet with green notes", price: 185 },
  //     ]
  //   },
  //   {
  //     id: "exclusive",
  //     name: "Exclusive Reserve",
  //     description: "Our most prestigious fragrances with the finest rare ingredients.",
  //     image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  //     products: [
  //       { id: "exc1", name: "Eternal Rose", description: "Rare Damascena roses with precious oud", price: 350 },
  //       { id: "exc2", name: "Noble Iris", description: "Luxurious iris with subtle woody notes", price: 320 },
  //       { id: "exc3", name: "Imperial Saffron", description: "Precious saffron blend with leather and amber", price: 380 },
  //       { id: "exc4", name: "Grand Vetiver", description: "Rare vetiver with citrus and spice", price: 340 },
  //     ]
  //   },
  //   {
  //     id: "travel",
  //     name: "Travel Collection",
  //     description: "Perfect sized fragrances for your journeys and adventures.",
  //     image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=800&q=80",
  //     products: [
  //       { id: "trv1", name: "Mediterranean Escape", description: "Citrus and sea notes", price: 95 },
  //       { id: "trv2", name: "Oriental Journey", description: "Exotic spices and sweet amber", price: 110 },
  //       { id: "trv3", name: "Alpine Adventure", description: "Fresh mountain air with pine and herbs", price: 90 },
  //       { id: "trv4", name: "Desert Mirage", description: "Warm sands and sweet resins", price: 100 },
  //     ]
  //   },
  // ];

  useEffect(() => {
    const fetchCollections = async () => {
      const tempCollections = await getProductsByCollection();
      setCollections(tempCollections);
      setLoading(false);
    };
    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src={suf} alt="Loading" className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir-900 text-foreground">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-screen-xl mx-auto"
        >
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-light mb-4">Our <span className="text-gold">Collections</span></h1>
            <p className="text-lg text-noir-300 max-w-3xl mx-auto">
              Explore our curated collections of premium fragrances, each telling its own unique story through carefully selected notes and compositions.
            </p>
          </div>
          
          <Tabs defaultValue={collections[0].id} className="mb-16">
            <TabsList className="w-full flex overflow-x space-x-2 bg-transparent mb-8">
              {collections.map((collection) => (
                <TabsTrigger 
                  key={collection.id} 
                  value={collection.id}
                  className="px-6 py-2 text-sm flex-shrink-0 data-[state=active]:bg-gold data-[state=active]:text-noir-900"
                >
                  {collection.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {collections.map((collection) => (
              <TabsContent key={collection.id} value={collection.id}>
                <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
                  <div>
                    <h2 className="text-3xl font-light mb-4 text-gold">{collection.name}</h2>
                    <p className="text-noir-300 mb-6">{collection.description}</p>
                    <Button className="bg-gold hover:bg-gold-dark text-noir-900">
                      Shop This Collection
                    </Button>
                  </div>
                  <div className="rounded-lg overflow-hidden shadow-lg h-80 bg-noir-800">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {collection.products.map((product) => (
                    <Link 
                      key={product.id} 
                      to={`/product/${product.id}`}
                      className="bg-noir-800 border border-noir-700 rounded-lg overflow-hidden hover:border-gold transition-colors"
                    >
                      <div className="aspect-square bg-noir-700 relative">
                        {/* Placeholder for product image */}
                        <div className="absolute inset-0 flex items-center justify-center text-noir-500">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">{product.name}</h3>
                        <p className="text-sm text-noir-400 mb-2">{product.description}</p>
                        <p className="text-gold">${product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="bg-noir-800 border border-noir-700 rounded-lg p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-light mb-4">Explore Limited Editions</h2>
            <p className="text-noir-300 mb-8 max-w-2xl mx-auto">
              Discover our exclusive limited edition fragrances, available for a short time only. 
              Each creation is a unique expression of artistry and innovation.
            </p>
            <Button className="bg-gold hover:bg-gold-dark text-noir-900">
              View Limited Editions
            </Button>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Collections;