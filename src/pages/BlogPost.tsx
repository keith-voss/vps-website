// Forced refresh
import Header from "@/components/Header";

import Footer from "@/components/Footer";
import EstimateModal from "@/components/EstimateModal";
import StickyCta from "@/components/StickyCta";
import CTACard from "@/components/blog/CTACard";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Navigate, Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { ArrowLeft } from "lucide-react";

import PageHero from "@/components/PageHero";

const BlogPost = () => {
    const [isEstimateOpen, setIsEstimateOpen] = useState(false);
    const { id } = useParams();
    const post = blogPosts.find(p => p.id === id);

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    return (
        <>
            <Helmet>
                <title>{post.title} | Voss Property Solutions</title>
                <meta name="description" content={post.excerpt} />
            </Helmet>

            <div className="min-h-screen bg-white font-sans text-gray-900">
                <Header onOpenEstimate={() => setIsEstimateOpen(true)} />

                <main className="pb-24">
                    <PageHero
                        title={post.title}
                        image={post.image}
                    />

                    <article className="max-w-4xl mx-auto px-6 mt-12">
                        {/* Back Link */}
                        <div className="mb-8">
                            <Link to="/blog" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-primary transition-colors">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to All Articles
                            </Link>
                        </div>

                        {/* Article Intro/Excerpt */}
                        <div className="mb-12">
                            <p className="text-lg text-gray-600 leading-relaxed italic border-l-4 border-primary pl-4">
                                {post.excerpt}
                            </p>
                        </div>

                        {/* Main Content Part 1 */}
                        <div
                            className="prose prose-lg max-w-none text-gray-800
                                prose-headings:font-bold prose-headings:text-gray-900 prose-headings:text-xl prose-headings:uppercase prose-headings:tracking-wide prose-headings:mb-3 prose-headings:mt-8
                                prose-p:leading-relaxed prose-p:mb-6
                                prose-strong:text-gray-900 prose-strong:font-bold"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Comparison Table */}
                        {post.comparisonData && (
                            <div className="my-12">
                                <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-gray-900">The Transformation: Before vs. After</h3>
                                <div className="border border-gray-200 rounded-sm overflow-hidden text-sm md:text-base">
                                    <div className="grid grid-cols-1 md:grid-cols-12 bg-gray-100 border-b border-gray-200 font-bold text-gray-700">
                                        <div className="md:col-span-3 p-4">Feature</div>
                                        <div className="md:col-span-4 p-4 md:border-l border-gray-200">Before</div>
                                        <div className="md:col-span-5 p-4 md:border-l border-gray-200">After</div>
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        {post.comparisonData.map((row, index) => (
                                            <div key={index} className="grid grid-cols-1 md:grid-cols-12 bg-white">
                                                <div className="md:col-span-3 p-4 font-bold text-gray-900 flex items-center bg-gray-50 md:bg-white">{row.feature}</div>
                                                <div className="md:col-span-4 p-4 md:border-l border-gray-200 text-gray-600">{row.before}</div>
                                                <div className="md:col-span-5 p-4 md:border-l border-gray-200 text-gray-800 font-medium bg-green-50/50">{row.after}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Conclusion Content */}
                        {post.conclusion && (
                            <div
                                className="prose prose-lg max-w-none text-gray-800 mt-8
                                    prose-headings:font-bold prose-headings:text-gray-900 prose-headings:text-xl prose-headings:uppercase prose-headings:tracking-wide prose-headings:mb-3 prose-headings:mt-8
                                    prose-p:leading-relaxed prose-p:mb-6"
                                dangerouslySetInnerHTML={{ __html: post.conclusion }}
                            />
                        )}

                        {/* CTA Card - Redesigned to match guide style */}
                        <div className="mt-16 pt-8 border-t border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Is Your Property High-Traffic and High-Risk?</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Don't wait for an accident or an OSHA violation to address your faded pavement markings. Whether you manage a retail campus, a warehouse, or a parking structure, our team provides the precision and durability you need.
                            </p>
                            <button
                                onClick={() => setIsEstimateOpen(true)}
                                className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-md hover:bg-primary/90 transition-colors shadow-sm"
                            >
                                Free Estimate
                            </button>
                        </div>

                    </article>
                </main>

                <Footer />
                <StickyCta onOpenEstimate={() => setIsEstimateOpen(true)} />
                <EstimateModal open={isEstimateOpen} onOpenChange={setIsEstimateOpen} />
            </div>
        </>
    );
};

export default BlogPost;
