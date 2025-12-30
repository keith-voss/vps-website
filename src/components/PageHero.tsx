import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PageHeroProps {
    title: string;
    description?: string;
    image: string;
    showCta?: boolean;
}

const PageHero = ({ title, description, image, showCta = false }: PageHeroProps) => {
    return (
        <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60" />
            </div>
            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4"
                >
                    {title}
                </motion.h1>
                {description && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8"
                    >
                        {description}
                    </motion.p>
                )}
                {showCta && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Button
                            variant="cta"
                            size="lg"
                            onClick={() => window.open('https://clienthub.getjobber.com/hubs/1674cd73-8232-415c-834e-837c9dc881a9/public/requests/2123840/new', '_blank')}
                            className="text-lg px-8 py-6 shadow-glow"
                        >
                            Get a Free Estimate
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default PageHero;
