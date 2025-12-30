import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const FAQSection = () => {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-start">
                    {/* Left Column: Content */}
                    <div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-industrial-black mb-6 leading-tight">
                            Your questions, answered
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Answers to the most common questions our customers have. If you don't find the information you're looking for, feel free to contact us.
                        </p>
                    </div>

                    {/* Right Column: Accordion */}
                    <div className="w-full">
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            <AccordionItem value="item-1" className="bg-white border border-border/50 rounded-xl px-2 shadow-sm">
                                <AccordionTrigger className="px-4 text-left hover:no-underline hover:text-primary transition-colors">
                                    What types of pavement marking services do you offer?
                                </AccordionTrigger>
                                <AccordionContent className="px-4 text-muted-foreground">
                                    We offer a comprehensive range of pavement marking services including parking lot striping, warehouse floor marking, safety signage, ADA compliance markings, and custom stenciling for commercial and industrial properties.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2" className="bg-white border border-border/50 rounded-xl px-2 shadow-sm">
                                <AccordionTrigger className="px-4 text-left hover:no-underline hover:text-primary transition-colors">
                                    Why is warehouse floor marking important?
                                </AccordionTrigger>
                                <AccordionContent className="px-4 text-muted-foreground">
                                    Warehouse floor marking is crucial for optimizing workflow efficiency and ensuring safety. It clearly delineates pedestrian walkways, forklift paths, storage areas, and hazardous zones, reducing accidents and improving overall organization.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3" className="bg-white border border-border/50 rounded-xl px-2 shadow-sm">
                                <AccordionTrigger className="px-4 text-left hover:no-underline hover:text-primary transition-colors">
                                    How often should a parking lot be re-striped?
                                </AccordionTrigger>
                                <AccordionContent className="px-4 text-muted-foreground">
                                    Generally, parking lots should be re-striped every 1 to 2 years, depending on traffic volume and weather conditions. Regular maintenance ensures visibility, safety, and a professional appearance for your property.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-4" className="bg-white border border-border/50 rounded-xl px-2 shadow-sm">
                                <AccordionTrigger className="px-4 text-left hover:no-underline hover:text-primary transition-colors">
                                    Do you offer free estimates?
                                </AccordionTrigger>
                                <AccordionContent className="px-4 text-muted-foreground">
                                    Yes, we provide free, no-obligation estimates for all our services. Contact us today at 443-970-1440 or fill out our online form to discuss your project needs.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
