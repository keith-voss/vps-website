import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EstimateModal from "@/components/EstimateModal";
import StickyCta from "@/components/StickyCta";
import ContactSection from "@/components/ContactSection";
import PageHero from "@/components/PageHero";
import heroGalleryImage from "@/assets/gallery/lines-and-stenciling-1.png";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Shield, MapPin, Wrench, MessageSquare, Briefcase } from "lucide-react";

import keithImage from "@/assets/keith.jpg";
// Using custom project image for "Who We Are" section visual
import whoWeAreImage from "@/assets/project-custom.jpg";

const About = () => {
    const [isEstimateOpen, setIsEstimateOpen] = useState(false);

    return (
        <>
            <Helmet>
                <title>About Us | Voss Property Solutions</title>
                <meta name="description" content="Learn about Voss Property Solutions, your partners in property excellence. Over 35 years of experience in pavement marking and warehouse safety." />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Header onOpenEstimate={() => setIsEstimateOpen(true)} />

                <main>
                    <PageHero
                        title="About Us"
                        image={heroGalleryImage}
                    />

                    {/* Intro & Mission Section */}
                    <section className="py-16 md:py-24">
                        <div className="container mx-auto px-4">
                            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                                {/* Image Left */}
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                    className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] md:aspect-square lg:aspect-[4/5]"
                                >
                                    <img
                                        src={whoWeAreImage}
                                        alt="Voss Property Solutions Team at Work"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
                                </motion.div>

                                {/* Content Right */}
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    <h2 className="text-sm font-bold text-primary text-uppercase tracking-wider mb-2">Who We Are</h2>
                                    <h3 className="font-heading text-3xl md:text-5xl font-bold text-industrial-black mb-6">
                                        Your Partners in Property Excellence
                                    </h3>
                                    <div className="space-y-4 text-lg text-muted-foreground mb-8 leading-relaxed">
                                        <p>
                                            At Voss Property Solutions, we believe your facility’s layout is the foundation of your operational safety and professional image. We aren't just striping lines; we are building organized, efficient, and compliant environments that protect your people and your investment.
                                        </p>
                                    </div>

                                    <div className="mb-8">
                                        <h4 className="font-heading text-2xl font-bold mb-4 text-industrial-black">What Drives Us</h4>
                                        <div className="space-y-4">
                                            {[
                                                { label: "Safety-First Culture", text: "We minimize risk by creating clear, logical flow for pedestrians and vehicles through high-visibility markings, stenciling, and signage." },
                                                { label: "Operational Excellence", text: "We help you get the most out of every square foot, whether that means maximizing parking capacity or optimizing warehouse pallet flow." },
                                                { label: "Professionalism", text: "A clean, well-maintained exterior reflects the quality of your business. We ensure your property looks its best from the moment a visitor arrives." },
                                                { label: "Long-Term Protection", text: "Our preventative approach extends the life of your surfaces, safeguarding your physical assets and your workforce." }
                                            ].map((item, id) => (
                                                <div key={id} className="flex gap-3">
                                                    <div className="mt-1.5"><CheckCircle className="w-5 h-5 text-primary" /></div>
                                                    <p className="text-muted-foreground"><span className="font-bold text-industrial-black">{item.label}:</span> {item.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-8 rounded-xl border-l-4 border-primary">
                                        <h4 className="font-heading text-xl font-bold mb-3">Our Mission</h4>
                                        <p className="text-muted-foreground italic leading-relaxed">
                                            To provide superior, reliable pavement marking, line striping and warehouse safety services, transforming customers into long-term partners through guaranteed quality and unwavering commitment.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Why Choose Voss Section */}
                    <section className="py-16 bg-gray-50">
                        <div className="container mx-auto px-4">
                            <div className="text-center max-w-3xl mx-auto mb-16">
                                <h2 className="font-heading text-3xl md:text-4xl font-bold text-industrial-black mb-4">Why Choose Voss?</h2>
                                <p className="text-lg text-muted-foreground">We know you have choices when it comes to property care. Here is how we stand out:</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                                {[
                                    {
                                        icon: MapPin,
                                        title: "Local Expertise",
                                        desc: "We live and work in Maryland. We understand the local market, the climate challenges, and the unique needs of our neighborhood."
                                    },
                                    {
                                        icon: Wrench,
                                        title: "Proactive Maintenance",
                                        desc: "We don’t just react to cracks and potholes—we prevent them. Extending the life of your pavement and save you from costly future repairs."
                                    },
                                    {
                                        icon: MessageSquare,
                                        title: "Integrity-First Approach",
                                        desc: "Clear communication and honest pricing are the pillars of our business. No hidden fees, no jargon—just results."
                                    },
                                    {
                                        icon: Briefcase,
                                        title: "Tailored Services",
                                        desc: "From community associations and commercial property managers, we provide scalable solutions tailored to your specific goals."
                                    }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white p-8 rounded-xl shadow-sm border border-border/50 hover:shadow-md transition-shadow flex gap-4"
                                    >
                                        <div className="bg-primary/10 p-3 rounded-lg h-fit">
                                            <item.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-heading text-xl font-bold mb-3">{item.title}</h3>
                                            <p className="text-muted-foreground">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Meet the Owner Section */}
                    <section className="py-20 md:py-28 bg-industrial-black text-white overflow-hidden relative">
                        {/* Background Element */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4 pointer-events-none" />

                        <div className="container mx-auto px-4 relative z-10">
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="order-2 lg:order-1">
                                    <span className="inline-block px-4 py-1.5 bg-primary/20 border border-primary/30 text-primary text-sm font-bold rounded-full mb-6">
                                        Leadership
                                    </span>
                                    <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">Meet the Owner</h2>
                                    <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                                        <p>
                                            Finding a contractor you can trust can be difficult. That’s why, after a long corporate career and 35 years of general contracting experience, my primary goal is simple: to make your interaction with Voss Property Solutions as seamless as possible.
                                        </p>
                                        <div className="py-6 border-y border-white/10 my-8">
                                            <h3 className="text-2xl font-serif text-white mb-2">"Relationships That Become Partnerships"</h3>
                                            <p className="text-gray-400 text-base">
                                                We don’t just provide a service; we build relationships. By truly listening to your needs, we provide customized solutions that transform customers into long-term partners.
                                            </p>
                                        </div>
                                        <p className="font-handwriting text-2xl text-primary pt-2">
                                            I hope to meet you soon,<br />
                                            <span className="text-3xl block mt-2 text-white">Keith</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                                    <div className="relative">
                                        <div className="absolute -inset-4 border-2 border-primary/30 rounded-2xl transform rotate-3" />
                                        <img
                                            src={keithImage}
                                            alt="Keith Voss"
                                            className="relative rounded-xl shadow-2xl max-w-sm w-full grayscale hover:grayscale-0 transition-all duration-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Guarantees Section */}
                    <section className="py-20 bg-background">
                        <div className="container mx-auto px-4">
                            <div className="text-center max-w-3xl mx-auto mb-16">
                                <h2 className="font-heading text-3xl md:text-4xl font-bold text-industrial-black mb-4">Our Professional Guarantee</h2>
                                <p className="text-lg text-muted-foreground">Let us take some burden off your shoulders. We promise:</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    {
                                        icon: Clock,
                                        title: "Quick, Courteous Service",
                                        desc: "We answer your call."
                                    },
                                    {
                                        icon: Shield,
                                        title: "Reliability",
                                        desc: "We show up when we say we are going to show up."
                                    },
                                    {
                                        icon: CheckCircle,
                                        title: "Satisfaction",
                                        desc: "If you are not happy with our work, then we are not done with our work, Period."
                                    }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ y: -5 }}
                                        className="bg-card p-8 rounded-2xl border border-border shadow-sm text-center flex flex-col items-center"
                                    >
                                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 shadow-glow">
                                            <item.icon className="w-8 h-8 text-industrial-black" />
                                        </div>
                                        <h3 className="font-heading text-xl font-bold mb-3">{item.title}</h3>
                                        <p className="text-muted-foreground">{item.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>

                <ContactSection onOpenEstimate={() => setIsEstimateOpen(true)} />
                <Footer />
                <StickyCta onOpenEstimate={() => setIsEstimateOpen(true)} />
                <EstimateModal open={isEstimateOpen} onOpenChange={setIsEstimateOpen} />
            </div>
        </>
    );
};

export default About;
