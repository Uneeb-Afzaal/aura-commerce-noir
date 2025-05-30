
import { motion } from "framer-motion";
import fem from "@/assets/images/fem.png";
import mal from "@/assets/images/mal.png";
import uni from "@/assets/images/unisex.jpg";
import { url } from "inspector";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: "1",
    name: "For Him",
    image: mal,
    url : "/shop?category=men",
    description: "Bold and sophisticated fragrances for the modern gentleman"
  },
  {
    id: "2",
    name: "For Her",
    image: fem,
    url : "/shop?category=women",
    description: "Elegant and captivating scents that leave a lasting impression"
  },
  {
    id: "3",
    name: "Unisex",
    image: uni,
    url : "/shop?category=unisex",
    description: "Gender-neutral fragrances for the individual who defies convention"
  },
];

export function CategoriesSection() {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-noir-800">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl mb-4 font-light">Explore Our <span className="text-gold">Collections</span></h2>
          <p className="text-noir-200 max-w-2xl mx-auto">
            Discover fragrances crafted for every personality and occasion, from bold statements to subtle elegance.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="group relative h-[500px] overflow-hidden rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="absolute inset-0 z-0">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-noir-900/60 to-transparent" />
              </div>
              
              <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                >
                  <h3 className="text-2xl font-medium mb-2 text-white">{category.name}</h3>
                  <p className="text-noir-100 mb-6">{category.description}</p>
                  <button 
                    onClick={()=> navigate(category.url)}
                    className="text-gold border-b border-gold hover:border-gold-light pb-1 hover:text-gold-light transition-colors"
                  >
                    Discover More
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
