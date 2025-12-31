import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface StickyCtaProps {
  onOpenEstimate: () => void;
}

const StickyCta = ({ onOpenEstimate }: StickyCtaProps) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2 }}
      className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-industrial-black/95 backdrop-blur-sm border-t border-background/10 md:hidden"
    >
      <div className="flex gap-3">
        <Button
          variant="cta"
          size="lg"
          onClick={() => window.open('https://clienthub.getjobber.com/hubs/1674cd73-8232-415c-834e-837c9dc881a9/public/requests/2123840/new', '_blank')}
          className="w-full shadow-lg"
        >
          Free Estimate
        </Button>
        <Button variant="heroOutline" size="lg" className="flex-shrink-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild>
          <a href="tel:+14439701440">
            <Phone className="w-5 h-5" />
          </a>
        </Button>
      </div>
    </motion.div>
  );
};

export default StickyCta;
