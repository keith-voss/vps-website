import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ContactSectionProps {
  onOpenEstimate: () => void;
}

const ContactSection = ({ onOpenEstimate }: ContactSectionProps) => {
  return (
    <section className="py-12 bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">

          {/* Text Left */}
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-industrial-black tracking-wide text-center md:text-left"
          >
            Need Pavement Marking or Warehouse Safety Solutions?
          </motion.h2>

          {/* Button Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button
              size="lg"
              onClick={() => window.open('https://clienthub.getjobber.com/hubs/1674cd73-8232-415c-834e-837c9dc881a9/public/requests/2123840/new', '_blank')}
              className="bg-industrial-black text-white font-bold text-lg px-8 py-6 rounded-md shadow-lg hover:bg-white hover:text-industrial-black transition-all border-2 border-transparent hover:border-industrial-black"
            >
              Free Estimate
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
