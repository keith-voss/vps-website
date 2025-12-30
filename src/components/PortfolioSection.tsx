import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import projectIndustrial from "@/assets/project-industrial.jpg";
import projectCommercial from "@/assets/project-commercial-stop.png";
import projectRegulatory from "@/assets/project-regulatory-ada-new.png";
import projectCustom from "@/assets/project-custom.jpg";

const coreServices = [
  {
    title: "Warehouse Safety",
    category: "Industrial",
    image: projectIndustrial,
    className: "",
  },
  {
    title: "Paving & Sealcoating",
    category: "Commercial",
    image: projectCommercial,
    className: "scale-125 group-hover:scale-135",
  },
  {
    title: "ADA Compliance",
    category: "Regulatory",
    image: projectRegulatory,
    className: "scale-125 group-hover:scale-135",
  },
  {
    title: "Custom Markings",
    category: "Specialty",
    image: projectCustom,
    className: "",
  },
];

const PortfolioSection = () => {
  return (
    <section id="portfolio" className="py-20 md:py-32 bg-industrial-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-semibold mb-4">
            Our Work
          </span>
          <h2 className="font-heading text-3xl md:text-5xl text-background mb-4">
            Projects & Solutions
          </h2>
          <p className="text-lg text-background/70 max-w-2xl mx-auto">
            Explore our latest projects showcasing our expertise in pavement marking and warehouse safety.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreServices.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl aspect-[3/4] cursor-pointer"
            >
              <Link to={`/projects?category=${encodeURIComponent(item.title)}`} className="block w-full h-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${item.className || "group-hover:scale-110"
                    }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-industrial-black/90 via-industrial-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-primary text-sm font-semibold mb-1 block">{item.category}</span>
                  <h3 className="font-heading text-xl text-background mb-2">{item.title}</h3>
                  <div className="flex items-center text-background/80 text-sm group-hover:text-primary transition-colors">
                    View Projects <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/projects"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-industrial-black font-bold uppercase tracking-wide rounded hover:bg-white transition-colors"
          >
            VIEW PROJECTS
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
