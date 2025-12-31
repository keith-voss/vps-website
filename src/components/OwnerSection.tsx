import { motion } from "framer-motion";
import { Shield, CheckCircle, Clock } from "lucide-react";
import keithImage from "@/assets/keith.jpg";

const OwnerSection = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src={keithImage}
                alt="Keith Voss - Owner of Voss Property Solutions"
                className="w-full max-w-md mx-auto rounded-lg shadow-elevated"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-primary/20 rounded-lg max-w-md mx-auto" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-4">
              Meet the Owner
            </span>
            <h2 className="font-heading text-3xl md:text-5xl mb-6">
              Keith Voss
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              With over 35 years of general contracting experience, I founded Voss Property Solutions with a simple mission: to build relationships that become partnerships. As an owner-operated business, I'm personally invested in every project we take on.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              I believe in doing things right the first time. That's why I offer my personal guarantee on every job—quick service, reliability, and 100% satisfaction.
            </p>

            {/* Guarantees */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg shadow-card">
                <Clock className="w-8 h-8 text-primary flex-shrink-0" />
                <span className="font-semibold text-sm">Quick Service</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg shadow-card">
                <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                <span className="font-semibold text-sm">Reliability</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg shadow-card">
                <CheckCircle className="w-8 h-8 text-primary flex-shrink-0" />
                <span className="font-semibold text-sm">100% Satisfaction</span>
              </div>
            </div>

            <p className="mt-8 text-lg font-semibold italic border-l-4 border-primary pl-4">
              "We deliver expert service with minimal business disruption."
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OwnerSection;
