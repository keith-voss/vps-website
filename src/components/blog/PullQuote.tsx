import { Quote } from "lucide-react";

interface PullQuoteProps {
    text: string;
}

const PullQuote = ({ text }: PullQuoteProps) => {
    return (
        <div className="my-16 relative">
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-10 md:p-12 border-l-4 border-primary shadow-lg">
                <Quote className="w-12 h-12 text-primary/30 mb-4" />
                <blockquote className="text-2xl md:text-3xl font-heading font-semibold text-industrial-black italic leading-relaxed">
                    "{text}"
                </blockquote>
            </div>
        </div>
    );
};

export default PullQuote;
