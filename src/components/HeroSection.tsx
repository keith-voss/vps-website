import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, Phone } from "lucide-react";
import heroEV from "@/assets/hero-ev-charging.jpg";
import heroADA from "@/assets/hero-ada-lot.jpg";
import heroHelipad from "@/assets/hero-helipad.jpg";
import heroWarehouse from "@/assets/hero-warehouse-wide.jpg";

interface HeroSectionProps {
  onOpenEstimate: () => void;
}

const HeroSection = ({ onOpenEstimate }: HeroSectionProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [heroADA, heroHelipad, heroWarehouse];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToServices = () => {
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-industrial-black overflow-hidden pt-20">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-primary/5 -skew-x-12 transform origin-top-right" />

      <div className="container mx-auto px-4 z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-block px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-semibold mb-6 backdrop-blur-sm">
                35+ Years of General Contracting Experience
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-heading text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 font-bold"
            >
              The Gold Standard in Pavement Marking &{" "}
              <span className="text-primary block mt-2">Warehouse Safety</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-gray-200 mb-6 max-w-xl leading-relaxed"
            >
              Voss Property Solutions delivers the precision and durability your facility demands to stay safe and compliant.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-primary font-semibold text-lg mb-10 tracking-wide"
            >
              Proudly serving Baltimore and surrounding counties
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Button
                  variant="cta"
                  size="xl"
                  onClick={() => window.open('https://clienthub.getjobber.com/hubs/1674cd73-8232-415c-834e-837c9dc881a9/public/requests/2123840/new', '_blank')}
                  className="w-full sm:w-auto shadow-glow px-10 py-7 text-lg uppercase tracking-wide"
                >
                  Get a Free Estimate
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  onClick={onOpenEstimate}
                  className="w-full sm:w-auto text-white border-white bg-transparent hover:bg-white hover:text-industrial-black transition-colors px-10 py-7 text-lg "
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call 443-970-1440
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative lg:h-[600px] w-full hidden lg:block"
          >
            <div className="absolute inset-0 bg-primary rounded-3xl transform rotate-3 scale-95 opacity-20"></div>
            <div className="absolute inset-0 bg-primary/10 rounded-3xl transform -rotate-2 scale-95"></div>
            <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={images[currentImage]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="w-full h-full object-cover"
                  alt="Voss Property Solutions Services"
                />
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-primary transition-colors animate-float"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.button>
    </section>
  );
};

export default HeroSection;
