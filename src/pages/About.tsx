
import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Info, BadgeCheck, Heart } from "lucide-react";

const About = () => {
  // Team members
  const team = [
    {
      name: "Alexandra Moreau",
      role: "Founder & Master Perfumer",
      bio: "With over 20 years of experience in fragrance creation, Alexandra's vision drives our artistic direction.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    },
    {
      name: "David Chen",
      role: "Creative Director",
      bio: "David oversees our brand identity and ensures each fragrance tells a compelling story.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    },
    {
      name: "Sophia Rodriguez",
      role: "Head of Product Development",
      bio: "Sophia leads our innovative approach to creating sustainable luxury fragrances.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80",
    },
    {
      name: "Marcus Johnson",
      role: "Chief Sustainability Officer",
      bio: "Marcus ensures our commitment to ethical sourcing and environmental responsibility.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    },
  ];

  // Values
  const values = [
    {
      title: "Artisanal Craftsmanship",
      description: "Every fragrance is meticulously crafted by our master perfumers, blending tradition with innovation.",
      icon: BadgeCheck,
    },
    {
      title: "Sustainable Luxury",
      description: "We source ingredients responsibly and create products that respect both people and planet.",
      icon: Heart,
    },
    {
      title: "Timeless Elegance",
      description: "Our creations transcend trends, designed to become cherished signature scents.",
      icon: Info,
    },
  ];

  // Timeline/history
  const timeline = [
    {
      year: "2010",
      title: "The Beginning",
      description: "Founded with a vision to create exceptional fragrances that tell unique stories.",
    },
    {
      year: "2014",
      title: "First Signature Collection",
      description: "Launched our acclaimed Signature Collection, establishing our reputation for excellence.",
    },
    {
      year: "2017",
      title: "Global Expansion",
      description: "Opened boutiques in Paris, New York, and Tokyo, bringing our vision to the world.",
    },
    {
      year: "2020",
      title: "Sustainable Initiative",
      description: "Pioneered our sustainability program, ensuring responsible practices across our supply chain.",
    },
    {
      year: "2023",
      title: "Artisan Collaboration",
      description: "Partnered with traditional artisans worldwide to preserve craftsmanship and create exceptional vessels.",
    },
  ];

  return (
    <div className="min-h-screen bg-noir-900 text-foreground">
      <Navbar />
      
      <main className="pt-32 pb-16">
        {/* Hero section */}
        <motion.div 
          className="container mx-auto px-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-light mb-6">Our <span className="text-gold">Story</span></h1>
            <p className="text-lg text-noir-300 mb-8">
              Born from a passion for artistry and olfactory excellence, our journey began with a simple belief: 
              that fragrance is more than scent—it's an experience, a memory, an expression of individuality.
            </p>
            <Button className="bg-gold hover:bg-gold-dark text-noir-900">
              Discover Our Philosophy
            </Button>
          </div>
        </motion.div>
        
        {/* Mission section with image */}
        <div className="bg-noir-800 py-20 mb-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="rounded-lg overflow-hidden h-96 bg-noir-700">
                <img
                  src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=800&q=80"
                  alt="Our craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-light mb-6">Our <span className="text-gold">Mission</span></h2>
                <p className="text-noir-300 mb-4">
                  We create exceptional fragrances that tell stories, evoke emotions, and become an extension of your identity. 
                  Our commitment to artisanal craftsmanship and sustainable practices drives everything we do.
                </p>
                <p className="text-noir-300 mb-6">
                  Each fragrance is a careful composition of the finest ingredients, sourced ethically from around the world. 
                  We believe in transparency, quality, and creating scents that stand the test of time.
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-0.5 w-8 bg-gold" />
                  <p className="text-gold italic">"Creating memories through scent"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Values section */}
        <motion.div 
          className="container mx-auto px-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-light mb-12 text-center">Our <span className="text-gold">Values</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-noir-800 border border-noir-700 rounded-lg p-6 text-center">
                <div className="mx-auto bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <value.icon className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-xl mb-3">{value.title}</h3>
                <p className="text-noir-300">{value.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Team section */}
        <motion.div 
          className="container mx-auto px-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl font-light mb-12 text-center">Meet Our <span className="text-gold">Team</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-noir-800 border border-noir-700 rounded-lg overflow-hidden">
                <div className="aspect-square bg-noir-700 relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-medium mb-1">{member.name}</h3>
                  <p className="text-gold text-sm mb-3">{member.role}</p>
                  <p className="text-noir-300 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Timeline/history section */}
        <motion.div 
          className="container mx-auto px-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-light mb-12 text-center">Our <span className="text-gold">Journey</span></h2>
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <div className="flex items-start gap-6">
                  <div className="bg-gold rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-noir-900 font-medium">
                    {item.year}
                  </div>
                  <div>
                    <h3 className="text-xl mb-2">{item.title}</h3>
                    <p className="text-noir-300">{item.description}</p>
                    {index < timeline.length - 1 && (
                      <div className="h-12 w-0.5 bg-noir-700 ml-6 mt-4 mb-4" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* CTA section */}
        <div className="bg-noir-800 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-light mb-6">Experience Our <span className="text-gold">Craftsmanship</span></h2>
            <p className="text-noir-300 mb-8 max-w-2xl mx-auto">
              Discover our collections and experience the artistry and passion that goes into each of our fragrances.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gold hover:bg-gold-dark text-noir-900">
                Shop Collections
              </Button>
              <Button variant="outline" className="border-gold text-gold hover:bg-gold/10">
                Visit Our Boutiques
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

<<<<<<< Updated upstream
export default About;
=======
export default About;
>>>>>>> Stashed changes
