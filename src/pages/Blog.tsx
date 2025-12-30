import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import EstimateModal from "@/components/EstimateModal";
import StickyCta from "@/components/StickyCta";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { User, ArrowRight } from "lucide-react";

import PageHero from "@/components/PageHero";
import heroGalleryImage from "@/assets/gallery/ada_compliance_4.jpeg";

const Blog = () => {
    const [isEstimateOpen, setIsEstimateOpen] = useState(false);

    return (
        <>
            <Helmet>
                <title>Blog | Voss Property Solutions</title>
                <meta name="description" content="Insights and updates on pavement marking, warehouse safety, and our latest projects." />
            </Helmet>

            <div className="min-h-screen bg-background">
                <Header onOpenEstimate={() => setIsEstimateOpen(true)} />

                <main>
                    <PageHero
                        title="Latest Insights"
                        image={heroGalleryImage}
                    />

                    <div className="container mx-auto px-4 py-16">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {blogPosts.map((post) => (
                                    <article key={post.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                                        <Link to={`/blog/${post.id}`} className="block">
                                            <div className="relative h-80 overflow-hidden">
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                <div className="absolute top-6 left-6">
                                                    <span className="inline-block bg-primary text-industrial-black text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                                                        {post.category}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-8">
                                                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                                                    <User className="w-4 h-4" />
                                                    <span className="font-medium">Keith Voss</span>
                                                    <span className="text-gray-300">•</span>
                                                    <span>5 min read</span>
                                                </div>

                                                <h2 className="text-2xl font-heading font-bold text-industrial-black mb-4 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                                                    {post.title}
                                                </h2>

                                                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                                                    {post.excerpt}
                                                </p>

                                                <div className="flex items-center text-primary font-semibold group-hover:gap-3 gap-2 transition-all duration-300">
                                                    <span>Read Full Article</span>
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                                </div>
                                            </div>
                                        </Link>
                                    </article>
                                ))}
                            </div>
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

export default Blog;
