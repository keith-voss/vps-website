import { motion } from "framer-motion";
import {
  Paintbrush,
  Accessibility,
  HardHat,
  CircleDot,
  TrafficCone,
  Brush,
  ArrowRight
} from "lucide-react";
import heroParking from "@/assets/hero-parking.jpg"; // Keeping for fallback if needed, but unused
import heroWarehouse from "@/assets/hero-warehouse.jpg"; // Keeping for fallback if needed, but unused
import serviceCustom from "@/assets/service-custom.jpg";
import serviceADA from "@/assets/service-ada.png";
import serviceWarehouse from "@/assets/service-warehouse.png";
import servicePaving from "@/assets/service-paving.jpg";
import serviceBollards from "@/assets/service-bollards.jpg";
import serviceStenciling from "@/assets/service-stenciling.jpg";

const services = [
  {
    icon: Paintbrush,
    title: "Custom Markings",
    description: "Specialized striping for unique layouts tailored to your specific business needs and traffic patterns.",
    image: serviceCustom
  },
  {
    icon: Accessibility,
    title: "ADA Compliance",
    description: "Ensuring your parking lots meet all legal accessibility standards with proper signage and markings.",
    image: serviceADA
  },
  {
    icon: HardHat,
    title: "Warehouse Safety",
    description: "Professional floor plans, forklift paths, and machinery protection zones for maximum workplace safety.",
    image: serviceWarehouse
  },
  {
    icon: CircleDot,
    title: "Paving & Sealcoating",
    description: "Protect the longevity of your asphalt investment with professional paving and sealcoating services.",
    image: servicePaving
  },
  {
    icon: TrafficCone,
    title: "Curbs & Delineators",
    description: "Traffic control solutions and physical safety barriers for clear pedestrian flow and vehicle guidance.",
    image: serviceBollards
  },
  {
    icon: Brush,
    title: "Lines & Stenciling",
    description: "Professional parking lot striping and stop sign installation solutions for maximum visibility.",
    image: serviceStenciling
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
            Our Services
          </span>
          <h2 className="font-heading text-3xl md:text-5xl mb-4">
            Comprehensive Property Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Protect your investment with our full range of pavement marking and warehouse safety services.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-elevated transition-all duration-300 overflow-hidden"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <div className="flex flex-col gap-2">
                  <div
                    onClick={() => window.location.href = `/projects?category=${encodeURIComponent(service.title)}`}
                    className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors cursor-pointer group/link"
                  >
                    View Projects <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </div>
                  <div
                    onClick={() => window.open('https://clienthub.getjobber.com/hubs/1674cd73-8232-415c-834e-837c9dc881a9/public/requests/2123840/new', '_blank')}
                    className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors cursor-pointer group/link"
                  >
                    Get Started <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
