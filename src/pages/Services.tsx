import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import EstimateModal from "@/components/EstimateModal";
import StickyCta from "@/components/StickyCta";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Settings, Warehouse, PaintBucket, ShieldCheck, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import PageHero from "@/components/PageHero";
import heroGalleryImage from "@/assets/gallery/lines-and-stenciling-3.png";
import heroWarehouse from "@/assets/hero-warehouse.jpg";
import serviceCustom from "@/assets/service-custom.jpg";
import serviceADA from "@/assets/service-ada.png";
import serviceWarehouse from "@/assets/service-warehouse.png";
import servicePaving from "@/assets/service-paving.jpg";
import serviceBollards from "@/assets/service-bollards.jpg";
import serviceStenciling from "@/assets/service-stenciling.jpg";

const services = [
    {
        icon: <Settings className="w-12 h-12 text-primary mb-4" />,
        title: "Custom Markings",
        description: "Specialized striping for unique layouts.",
        image: serviceCustom
    },
    {
        icon: <PaintBucket className="w-12 h-12 text-primary mb-4" />,
        title: "ADA Compliance",
        description: "Ensuring parking lots meet legal accessibility standards.",
        image: serviceADA
    },
    {
        icon: <Warehouse className="w-12 h-12 text-primary mb-4" />,
        title: "Warehouse Safety",
        description: "Floorplans, forklift paths, and machinery protection.",
        image: serviceWarehouse
    },
    {
        icon: <ShieldCheck className="w-12 h-12 text-primary mb-4" />,
        title: "Paving & Sealcoating",
        description: "Protecting the longevity of the asphalt.",
        image: servicePaving
    },
    {
        icon: <ShieldCheck className="w-12 h-12 text-primary mb-4" />,
        title: "Curbs & Delineators",
        description: "Traffic control and physical safety barriers.",
        image: serviceBollards
    },
    {
        icon: <PaintBucket className="w-12 h-12 text-primary mb-4" />,
        title: "Lines & Stenciling",
        description: "Parking Lot striping, custom stencling solutions.",
        image: serviceStenciling
    }
];

const Services = () => {
    const [isEstimateOpen, setIsEstimateOpen] = useState(false);

    return (
        <>
            <Helmet>
                <title>Services | Voss Property Solutions</title>
                <meta name="description" content="Pavement marking, warehouse safety solutions, and parking lot maintenance services. Custom solutions for efficient vehicle/pedestrian flow and optimal space utilization." />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Header onOpenEstimate={() => setIsEstimateOpen(true)} />

                <main>
                    <PageHero
                        title="Pavement Marking and Warehouse Safety Solutions"
                        image={heroGalleryImage}
                    />

                    <div className="container mx-auto px-4 py-16">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                            {services.map((service, index) => (
                                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-border/50 overflow-hidden flex flex-col h-full">
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-heading font-bold text-industrial-black">
                                            {service.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col flex-grow">
                                        <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                                            {service.description}
                                        </p>
                                        <div className="space-y-4">
                                            <div
                                                onClick={() => window.location.href = `/projects?category=${encodeURIComponent(service.title)}`}
                                                className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors cursor-pointer group/link mr-4"
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
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>

                <ContactSection onOpenEstimate={() => setIsEstimateOpen(true)} />
                <Footer />
                <StickyCta onOpenEstimate={() => setIsEstimateOpen(true)} />
                <EstimateModal open={isEstimateOpen} onOpenChange={setIsEstimateOpen} />
            </div>
        </>
    );
};

export default Services;
