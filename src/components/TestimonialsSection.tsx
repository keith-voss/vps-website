import { motion } from "framer-motion";
import { Star, User } from "lucide-react";
import { useRef } from "react";

const testimonials = [
  {
    name: "Michael R.",
    rating: 5,
    text: "Keith and his team did an outstanding job on our warehouse floor markings. Professional, punctual, and the quality exceeded our expectations.",
  },
  {
    name: "Sarah T.",
    rating: 5,
    text: "We've used Voss Property Solutions for all our parking lot maintenance. Their attention to ADA compliance gives us peace of mind.",
  },
  {
    name: "David L.",
    rating: 5,
    text: "The best line striping company we've worked with. They completed our shopping center in record time with zero disruption.",
  },
  {
    name: "Jennifer M.",
    rating: 5,
    text: "Reliable, professional, and reasonably priced. Keith personally oversees every project which makes a huge difference.",
  },
  {
    name: "Robert K.",
    rating: 5,
    text: "Our warehouse safety markings have significantly reduced accidents. Highly recommend their industrial safety services.",
  },
];

const TestimonialsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-muted overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
            Testimonials
          </span>
          <h2 className="font-heading text-3xl md:text-5xl mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Building relationships that become partnerships through exceptional service.
          </p>
        </motion.div>
      </div>

      {/* Horizontal Scrolling Testimonials */}
      <div className="relative">
        <motion.div
          ref={scrollRef}
          className="flex gap-6 px-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-6 animate-scroll">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % testimonials.length) * 0.1 }}
                className="flex-shrink-0 w-80 md:w-96 p-6 bg-card rounded-xl shadow-card snap-center"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-semibold">{testimonial.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
