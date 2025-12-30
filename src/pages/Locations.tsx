import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import EstimateModal from "@/components/EstimateModal";
import StickyCta from "@/components/StickyCta";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import PageHero from "@/components/PageHero";

// Map Images
import mapBaltimoreCity from "@/assets/map-baltimore-city.jpg";
import mapBaltimoreCounty from "@/assets/map-baltimore-county.jpg";
import mapAnneArundel from "@/assets/map-anne-arundel-county.jpg";
import mapHoward from "@/assets/map-howard-county.jpg";
import mapHarford from "@/assets/map-harford-county.jpg";
import mapCecil from "@/assets/map-cecil-county.jpg";
import mapPrinceGeorges from "@/assets/map-prince-georges-county.jpg";
import mapMontgomery from "@/assets/map-montgomery-county.jpg";
import heroGalleryImage from "@/assets/gallery/ada-compliance-3.png";

const locations = [
    {
        id: "baltimore-city",
        state: "Baltimore City",
        image: mapBaltimoreCity,
        description: "Serving all neighborhoods and industrial zones within the city limits."
    },
    {
        id: "baltimore-county",
        state: "Baltimore County",
        image: mapBaltimoreCounty,
        description: "Extensive coverage from Towson to Catonsville and everywhere in between."
    },
    {
        id: "anne-arundel",
        state: "Anne Arundel County",
        image: mapAnneArundel,
        description: "Serving Annapolis, Glen Burnie, and surrounding communities."
    },
    {
        id: "howard",
        state: "Howard County",
        image: mapHoward,
        description: "Providing solutions for Columbia, Ellicott City, and the I-95 corridor."
    },
    {
        id: "harford",
        state: "Harford County",
        image: mapHarford,
        description: "Serving Bel Air, Aberdeen, and surrounding areas."
    },
    {
        id: "cecil",
        state: "Cecil County",
        image: mapCecil,
        description: "Providing services to Elkton, North East, and beyond."
    },
    {
        id: "prince-georges",
        state: "Prince George's County",
        image: mapPrinceGeorges,
        description: "Extensive coverage for Bowie, Laurel, and surrounding regions."
    },
    {
        id: "montgomery",
        state: "Montgomery County",
        image: mapMontgomery,
        description: "Serving Rockville, Gaithersburg, and the surrounding communities."
    }
];

const Locations = () => {
    const [isEstimateOpen, setIsEstimateOpen] = useState(false);

    return (
        <>
            <Helmet>
                <title>Locations | Voss Property Solutions</title>
                <meta name="description" content="Serving the Mid-Atlantic region including Maryland, Pennsylvania, Delaware, Virginia, and West Virginia." />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Header onOpenEstimate={() => setIsEstimateOpen(true)} />

                <main>
                    <PageHero
                        title="Service Locations"
                        image={heroGalleryImage}
                    />

                    <div className="container mx-auto px-4 py-16">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="font-heading text-3xl md:text-4xl font-bold text-industrial-black mb-4">
                                Serving Baltimore & Surrounding Counties
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                We proudly provide pavement marking and warehouse safety solutions within Baltimore and surrounding counties.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {locations.map((loc) => (
                                <div
                                    key={loc.id}
                                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border/50 group"
                                >
                                    <div className="relative aspect-[4/3] p-8 bg-gray-50 flex items-center justify-center">
                                        <img
                                            src={loc.image}
                                            alt={`${loc.state} Service Area`}
                                            className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6 text-center">
                                        <h3 className="font-heading font-bold text-industrial-black text-xl mb-2">{loc.state}</h3>
                                        <p className="text-muted-foreground">{loc.description}</p>
                                    </div>
                                </div>
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

export default Locations;
