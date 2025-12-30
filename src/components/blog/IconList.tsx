import { LucideIcon } from "lucide-react";

interface IconListProps {
    title: string;
    items: Array<{
        icon: LucideIcon;
        text: string;
    }>;
}

const IconList = ({ title, items }: IconListProps) => {
    return (
        <div className="my-12">
            <h3 className="text-2xl font-heading font-bold text-primary mb-6">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                        >
                            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-700 leading-relaxed font-medium">{item.text}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default IconList;
