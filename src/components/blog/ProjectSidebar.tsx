import { MapPin, Building2, RefreshCw } from "lucide-react";

interface ProjectSidebarProps {
    location: string;
    clientType: string;
    serviceModel: string;
}

const ProjectSidebar = ({ location, clientType, serviceModel }: ProjectSidebarProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sticky top-24">
            <h3 className="text-xl font-heading font-bold text-industrial-black mb-6 pb-3 border-b-2 border-primary/20">
                Project at a Glance
            </h3>

            <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</p>
                        <p className="text-base font-medium text-industrial-black">{location}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Client Type</p>
                        <p className="text-base font-medium text-industrial-black">{clientType}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Service Model</p>
                        <p className="text-base font-medium text-industrial-black">{serviceModel}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectSidebar;
