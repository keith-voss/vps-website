import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import OwnerSection from "@/components/OwnerSection";
import PortfolioSection from "@/components/PortfolioSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import StickyCta from "@/components/StickyCta";
import EstimateModal from "@/components/EstimateModal";

import FAQSection from "@/components/FAQSection";

const Index = () => {
  const [isEstimateOpen, setIsEstimateOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Voss Property Solutions | #1 Pavement Marking & Warehouse Safety</title>
        <meta
          name="description"
          content="Professional pavement marking, warehouse safety striping, parking lot maintenance, and ADA compliance contractor. 35+ years experience. Free estimates. Call 443-970-1440."
        />
        <meta
          name="keywords"
          content="pavement marking, warehouse safety striping, parking lot maintenance, ADA compliance contractor, excavation services, line striping, sealcoating"
        />
        <link rel="canonical" href="https://vosspropertysolutions.com" />

        {/* Open Graph */}
        <meta property="og:title" content="Voss Property Solutions | Pavement Marking & Warehouse Safety" />
        <meta property="og:description" content="Professional pavement marking and warehouse safety solutions. Owner-operated with 35+ years experience." />
        <meta property="og:type" content="website" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Voss Property Solutions",
            "description": "Professional pavement marking, warehouse safety striping, and parking lot maintenance services.",
            "telephone": "+1-443-970-1440",
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "MD",
              "addressCountry": "US"
            },
            "priceRange": "$$",
            "openingHours": "Mo-Fr 07:00-18:00"
          })}
        </script>
      </Helmet>

      <main className="overflow-hidden">
        <Header onOpenEstimate={() => setIsEstimateOpen(true)} />
        <HeroSection onOpenEstimate={() => setIsEstimateOpen(true)} />
        <ServicesSection />
        <OwnerSection />
        <PortfolioSection />
        {/* <TestimonialsSection /> */}
        <FAQSection />
        <Footer />
        <StickyCta onOpenEstimate={() => setIsEstimateOpen(true)} />
        <EstimateModal open={isEstimateOpen} onOpenChange={setIsEstimateOpen} />
      </main>
    </>
  );
};

export default Index;
