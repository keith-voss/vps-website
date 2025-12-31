import { ArrowRight } from "lucide-react";

interface CTACardProps {
    title: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;
}

const CTACard = ({
    title,
    description,
    buttonText = "Get a Free Safety Assessment",
    buttonLink = "https://clienthub.getjobber.com/hubs/1674cd73-8232-415c-834e-837c9dc881a9/public/requests/2123840/new"
}: CTACardProps) => {
    return (
        <div className="my-16">
            <div className="relative bg-gradient-to-br from-industrial-black via-gray-900 to-gray-800 rounded-3xl p-10 md:p-16 overflow-hidden shadow-2xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                        {title}
                    </h2>
                    <p className="text-xl text-gray-300 leading-relaxed mb-10">
                        {description}
                    </p>
                    <a
                        href={buttonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-industrial-black font-bold text-lg rounded-xl hover:bg-primary/90 hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
                    >
                        {buttonText}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CTACard;
