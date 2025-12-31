import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import EstimateModal from "@/components/EstimateModal";
import StickyCta from "@/components/StickyCta";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import heroGalleryImage from "@/assets/gallery/custom-marking-0.jpg";
// Dynamic import of all images in the gallery folder
const galleryImages = import.meta.glob('@/assets/gallery/*.{png,jpg,jpeg,PNG,JPG,JPEG}', { eager: true, as: 'url' });

const projects = Object.entries(galleryImages).map(([path, url], index) => {
    // Extract filename from path
    const filename = path.split('/').pop()?.split('.')[0] || `Project ${index + 1}`;

    // Determine category based on filename
    let category = "Custom Markings"; // Default
    const lowerName = filename.toLowerCase();

    if (lowerName.includes('warehouse')) {
        category = "Warehouse Safety";
    } else if (lowerName.includes('curb') || lowerName.includes('delineator')) {
        category = "Curbs & Delineators";
    } else if (lowerName.includes('ada')) {
        category = "ADA Compliance";
    } else if (lowerName.includes('paving') || lowerName.includes('sealcoating')) {
        category = "Paving & Sealcoating";
    } else if (lowerName.includes('line') || lowerName.includes('stripe') || lowerName.includes('stenciling')) {
        category = "Lines & Stenciling";
    } else if (lowerName.includes('custom')) {
        category = "Custom Markings";
    }

    // Format title: replace hyphens/underscores with spaces and capitalize
    const title = filename
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());

    return {
        id: index + 1,
        category,
        image: url as string,
        title,
        location: "Maryland" // Default location
    };
});

const categories = [
    "All",
    "Custom Markings",
    "ADA Compliance",
    "Warehouse Safety",
    "Paving & Sealcoating",
    "Curbs & Delineators",
    "Lines & Stenciling"
];

const Projects = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isEstimateOpen, setIsEstimateOpen] = useState(false);
    const initialCategory = searchParams.get("category") || "All";
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedProject, setSelectedProject] = useState<{ id: number; image: string; title: string; category: string; location: string } | null>(null);
    const projectsTopRef = useRef<HTMLDivElement>(null);

    // Sync state with URL params
    useEffect(() => {
        const cat = searchParams.get("category") || "All";
        setSelectedCategory(cat);

        // Scroll logic
        if (cat !== "All" && projectsTopRef.current) {
            // Slight delay to ensure layout is ready and override any scroll-to-top behavior
            setTimeout(() => {
                projectsTopRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        } else {
            window.scrollTo(0, 0);
        }
    }, [searchParams]);

    const handleCategoryChange = (cat: string) => {
        if (cat === "All") {
            searchParams.delete("category");
        } else {
            searchParams.set("category", cat);
        }
        setSearchParams(searchParams);
    };

    const filteredProjects = selectedCategory === "All"
        ? projects
        : projects.filter(p => p.category === selectedCategory);

    const handleNext = () => {
        if (!selectedProject) return;
        const currentIndex = filteredProjects.findIndex(p => p.id === selectedProject.id);
        const nextIndex = (currentIndex + 1) % filteredProjects.length;
        setSelectedProject(filteredProjects[nextIndex]);
    };

    const handlePrev = () => {
        if (!selectedProject) return;
        const currentIndex = filteredProjects.findIndex(p => p.id === selectedProject.id);
        const prevIndex = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
        setSelectedProject(filteredProjects[prevIndex]);
    };

    return (
        <>
            <Helmet>
                <title>Our Work | Voss Property Solutions</title>
                <meta name="description" content="View our portfolio of pavement marking, warehouse safety, and line striping projects across Maryland." />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Header onOpenEstimate={() => setIsEstimateOpen(true)} />

                <main>
                    <PageHero
                        title="Our Work"
                        image={heroGalleryImage}
                    />

                    <div ref={projectsTopRef} className="container mx-auto px-4 py-16">
                        <div className="flex flex-col md:flex-row gap-12">
                            {/* Sidebar Categories */}
                            <aside className="w-full md:w-72 flex-shrink-0">
                                <div className="sticky top-24">
                                    <h2 className="text-xl font-bold mb-6 text-gray-900 border-l-4 border-primary pl-4">Categories</h2>
                                    <Tabs
                                        value={selectedCategory}
                                        orientation="vertical"
                                        className="w-full"
                                    >
                                        <TabsList className="flex flex-col h-auto bg-transparent border-none p-0 gap-2 items-start">
                                            {categories.map(cat => (
                                                <TabsTrigger
                                                    key={cat}
                                                    value={cat}
                                                    onClick={() => handleCategoryChange(cat)}
                                                    className="w-full justify-start px-4 py-3 rounded-lg text-left text-base data-[state=active]:bg-primary data-[state=active]:text-white text-gray-600 hover:bg-gray-100 transition-all font-medium"
                                                >
                                                    {cat}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                    </Tabs>
                                </div>
                            </aside>

                            {/* Gallery Grid */}
                            <div className="flex-grow">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filteredProjects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="group cursor-pointer relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
                                            onClick={() => setSelectedProject(project)}
                                        >
                                            <div className="aspect-square w-full">
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {filteredProjects.length === 0 && (
                                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                        <p className="text-gray-500 text-lg">No projects found in this category yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                <ContactSection onOpenEstimate={() => setIsEstimateOpen(true)} />
                <Footer />
                <StickyCta onOpenEstimate={() => setIsEstimateOpen(true)} />
                <EstimateModal open={isEstimateOpen} onOpenChange={setIsEstimateOpen} />

                <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
                    <DialogContent className="max-w-6xl w-[90vw] p-0 overflow-hidden bg-transparent border-none shadow-none text-white focus:outline-none">
                        <div className="relative w-full h-full flex items-center justify-center">
                            {selectedProject && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                        className="absolute left-2 md:left-4 z-50 p-2 md:p-3 bg-black/50 hover:bg-primary/80 rounded-full text-white transition-all backdrop-blur-sm"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                                    </button>

                                    <div className="relative max-h-[85vh] w-full flex flex-col items-center">
                                        <img
                                            src={selectedProject.image}
                                            alt={selectedProject.title}
                                            className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                                        />
                                        <div className="mt-4 text-center">
                                            <h3 className="text-xl md:text-2xl font-bold">{selectedProject.title}</h3>
                                            <p className="text-gray-300">{selectedProject.category} | {selectedProject.location}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                        className="absolute right-2 md:right-4 z-50 p-2 md:p-3 bg-black/50 hover:bg-primary/80 rounded-full text-white transition-all backdrop-blur-sm"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                                    </button>
                                </>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};

export default Projects;
