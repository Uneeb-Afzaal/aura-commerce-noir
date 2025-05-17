
import { useState , useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/ui/product-card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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

// // Mock product data
// const products = [
//   {
//     id: "1",
//     name: "Oud Noir Intense",
//     brand: "Sufianah",
//     price: 215,
//     imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=500&q=60",
//     rating: 5
//   },
//   {
//     id: "2",
//     name: "Ambre Éternel",
//     brand: "Exclusive",
//     price: 175,
//     imageUrl: "https://images.unsplash.com/photo-1557170334-a9086426b0c2?auto=format&fit=crop&w=500&q=60",
//     rating: 4
//   },
//   {
//     id: "3",
//     name: "Velvet Rose & Gold",
//     brand: "Sufianah",
//     price: 195,
//     imageUrl: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=500&q=60",
//     rating: 5
//   },
//   {
//     id: "4",
//     name: "Bois de Santal",
//     brand: "Luxury",
//     price: 230,
//     imageUrl: "https://images.unsplash.com/photo-1595425970377-c9393ee12689?auto=format&fit=crop&w=500&q=60",
//     rating: 4
//   },
//   {
//     id: "5",
//     name: "Midnight Orchid",
//     brand: "Sufianah",
//     price: 185,
//     imageUrl: "https://images.unsplash.com/photo-1615341805327-154891803c7f?auto=format&fit=crop&w=500&q=60",
//     rating: 5
//   },
//   {
//     id: "6",
//     name: "Vetiver & Amber",
//     brand: "Premium",
//     price: 165,
//     imageUrl: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&w=500&q=60",
//     rating: 4
//   },
//   {
//     id: "7",
//     name: "Saffron Oud",
//     brand: "Luxury",
//     price: 260,
//     imageUrl: "https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&w=500&q=60",
//     rating: 5
//   },
//   {
//     id: "8",
//     name: "Noir Absolu",
//     brand: "Sufianah",
//     price: 210,
//     imageUrl: "https://images.unsplash.com/photo-1559783510-c056abca0733?auto=format&fit=crop&w=500&q=60",
//     rating: 4
//   },
// ];

// Filter categories
const categories = [
  { id: "all", name: "All Fragrances" },
  { id: "men", name: "For Him" },
  { id: "women", name: "For Her" },
  { id: "unisex", name: "Unisex" },
];

const brands = ["Sufianah", "Luxury", "Exclusive", "Premium"];
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" },
];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState<Product[]>();
  const [isLoading, setIsLoading] = useState(true);

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
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
                Explore our exquisite collection of luxury fragrances crafted to captivate the senses and leave an unforgettable impression.
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
                    defaultValue={[0, 500]}
                    min={0}
                    max={500}
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
                      <Checkbox id={`rating-${rating}`} />
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
              
              <Button className="w-full mt-6 bg-gold hover:bg-gold-dark text-noir-900">
                Apply Filters
              </Button>
            </motion.aside>
            
            {/* Products Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {products.map((product, index) => (
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
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shop;
