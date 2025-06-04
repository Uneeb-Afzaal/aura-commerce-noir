
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import banner from "@/assets/images/banner2.png";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col justify-end">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-noir-900/80 to-transparent z-10" />
        {/* <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
          poster="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=1600&auto=format"
        >
          <source src="https://videos.pexels.com/videos/man-applying-perfume-6764443" type="video/mp4" />
        </video> */}
        <img
          src={banner}
          alt="Hero Image"
          className="object-cover w-full h-full"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10 pt-24 pb-20 md:pb-32">
        <div className="max-w-2xl">
          {/* <motion.p 
            className="text-gold uppercase tracking-widest font-medium mb-4 text-sm"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            Introducing Our Latest Collection
          </motion.p> */}
          
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            Inspired by Tradtion <br />
            <span className="text-gold italic">Designed for Soul</span>
          </motion.h1>
          
          <motion.p 
            className="text-noir-100 text-lg md:text-xl mb-8 max-w-lg"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            Experience luxury fragrances that captivate the senses and leave an unforgettable impression.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Button onClick={()=>navigate('/shop')} className="bg-gradient-to-r from-gold-light to-gold hover:bg-gold-dark font-bold text-noir-900 px-8 py-6">
              Shop Now
            </Button>
            <Button onClick={()=>navigate('/collections')}  variant="outline" className="border-gold font-bold text-gold hover:bg-gold/10 px-8 py-6">
              Explore Collections <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div 
          className="h-12 w-0.5 bg-gold/50 mx-auto mb-2"
          animate={{ 
            scaleY: [0.3, 1, 0.3], 
            opacity: [0.2, 1, 0.2],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5
          }} 
        />
        <span className="text-xs uppercase tracking-widest text-gold/80">Scroll</span>
      </motion.div>
    </section>
  );
}
