import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/ui/product-card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/lib/product-service";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Product } from "@/types";
import { useSearchParams } from 'react-router-dom';

const categories = [
  { id: "all", name: "All Fragrances" },
  { id: "men", name: "For Him" },
  { id: "women", name: "For Her" },
  { id: "unisex", name: "Unisex" },
];

const brands = ["Sufianah"]; 
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  
  // Initialize selectedCategory with URL parameter if present
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'all');
  
  // Update selectedCategory when URL changes
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);
  
  // Update URL when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };
  
  // Modify the category buttons to use handleCategoryChange
  {categories.map((category) => (
    <button
      key={category.id}
      className={`block w-full text-left px-2 py-1.5 rounded-md transition-colors ${
        selectedCategory === category.id
          ? "bg-gold/10 text-gold"
          : "hover:bg-noir-700"
      }`}
      onClick={() => handleCategoryChange(category.id)}
    >
      {category.name}
      {selectedCategory === category.id && (
        <ChevronRight className="inline-block h-4 w-4 ml-2" />
      )}
    </button>
  ))}
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const toggleRating = (rating: number) => {
    if (selectedRatings.includes(rating)) {
      setSelectedRatings(selectedRatings.filter(r => r !== rating));
    } else {
      setSelectedRatings([...selectedRatings, rating]);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getProducts();
        setProducts(products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Category filter (assuming products have a 'category' field)
      const matchesCategory = selectedCategory === "all" || 
                            (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());
      
      // Price filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      // Brand filter
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      
      // Rating filter
      const matchesRating = selectedRatings.length === 0 || 
                          selectedRatings.some(rating => Math.floor(product.rating) >= rating);
      
      return matchesSearch && matchesCategory && matchesPrice && matchesBrand && matchesRating;
    });
  }, [products, searchQuery, selectedCategory, priceRange, selectedBrands, selectedRatings]);

  const sortedProducts = useMemo(() => {
    const productsToSort = [...filteredProducts];
    switch (sortBy) {
      case "price-asc":
        return productsToSort.sort((a, b) => a.price - b.price);
      case "price-desc":
        return productsToSort.sort((a, b) => b.price - a.price);
      case "rating":
        return productsToSort.sort((a, b) => b.rating - a.rating);
      default: // "featured"
        return productsToSort;
    }
  }, [filteredProducts, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-noir-900 text-foreground">
        <Navbar />
        <main className="pt-24">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-gold/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-gold rounded-full animate-spin border-t-transparent"></div>
              </div>
              <p className="mt-6 text-gold/80 text-lg font-light">
                Loading exquisite fragrances...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir-900 text-foreground">
      <Navbar />
      
      <main className="pt-24">
        {/* Hero Banner */}
        <div className="h-64 md:h-80 relative overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?auto=format&fit=crop&w=2000&q=80" 
              alt="Shop Banner"
              className="w-full h-full object-cover opacity-40" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-noir-900 via-noir-900/90 to-noir-900/80" />
          </div>
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div>
              <h1 className="text-3xl md:text-5xl font-light mb-4">Shop <span className="text-gold">Fragrances</span></h1>
              <p className="text-noir-100 max-w-xl">
              Experience the divine harmony of Sufianah’s luxurious scents, crafted to elevate the soul and leave a lasting, spiritual impression. Each fragrance is a journey of elegance, designed to captivate and inspire.
              </p>
            </div>
          </div>
        </div>
        
        {/* Shop Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Search and Filter Bar */}
          <div className="flex flex-wrap gap-4 items-center justify-between mb-8 pb-6 border-b border-noir-700">
            <div className="relative w-full md:w-auto min-w-[280px]">
              <Input 
                type="search" 
                placeholder="Search fragrances..." 
                className="bg-noir-800 border-noir-700 pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-noir-400" />
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-noir-800 border-noir-700 w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-noir-800 border-noir-700">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                className="border-noir-700 md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <motion.aside
              className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6 bg-noir-800 rounded-lg border border-noir-700 mb-6">
                <h3 className="font-medium mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`block w-full text-left px-2 py-1.5 rounded-md transition-colors ${
                        selectedCategory === category.id
                          ? "bg-gold/10 text-gold"
                          : "hover:bg-noir-700"
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                      {selectedCategory === category.id && (
                        <ChevronRight className="inline-block h-4 w-4 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-6 bg-noir-800 rounded-lg border border-noir-700 mb-6">
                <h3 className="font-medium mb-4">Price Range</h3>
                <div className="pt-4 pb-2">
                  <Slider
                    defaultValue={[0, 10000]}
                    min={0}
                    max={50000}
                    step={10}
                    value={priceRange}
                    onValueChange={(values) => setPriceRange(values)}
                  />
                </div>
                <div className="flex justify-between items-center mt-4 text-sm">
                  <span>PKR {priceRange[0]}</span>
                  <span>PKR {priceRange[1]}</span>
                </div>
              </div>
              
              <div className="p-6 bg-noir-800 rounded-lg border border-noir-700 mb-6">
                <h3 className="font-medium mb-4">Brands</h3>
                <div className="space-y-3">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center">
                      <Checkbox 
                        id={`brand-${brand}`}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={() => toggleBrand(brand)}
                      />
                      <label
                        htmlFor={`brand-${brand}`}
                        className="ml-2 text-sm font-medium leading-none cursor-pointer"
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 bg-noir-800 rounded-lg border border-noir-700">
                <h3 className="font-medium mb-4">Rating</h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <Checkbox 
                        id={`rating-${rating}`}
                        checked={selectedRatings.includes(rating)}
                        onCheckedChange={() => toggleRating(rating)}
                      />
                      <label
                        htmlFor={`rating-${rating}`}
                        className="ml-2 flex gap-1 items-center cursor-pointer"
                      >
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${i < rating ? "text-gold" : "text-noir-500"}`}
                            >
                              ★
                            </span>
                          ))}
                        <span className="text-xs ml-1">& Up</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
            
            {/* Products Grid */}
            <div className="flex-1">
              {sortedProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {sortedProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <ProductCard {...product} />
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center mt-12">
                    <Button className="bg-gold hover:bg-gold-dark text-noir-900 px-8">
                      Load More
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-noir-400 mb-4">No products match your filters</p>
                  <Button 
                    variant="outline" 
                    className="border-noir-700"
                    onClick={() => {
                      setSelectedCategory("all");
                      setPriceRange([0, 10000]);
                      setSelectedBrands([]);
                      setSelectedRatings([]);
                      setSearchQuery("");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;