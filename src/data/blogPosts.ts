import { baltimoreCampusPost } from "./posts/baltimore-campus";
import { hospitalCampusPost } from "./posts/hospital-campus";
import { warehouseSafetyPost } from "./posts/warehouse-safety";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  comparisonData?: {
    feature: string;
    before: string;
    after: string;
  }[];
  conclusion?: string;
  category: string;
  date: string;
  image: string;
  projectDetails?: {
    location: string;
    clientType: string;
    serviceModel: string;
  };
  pullQuote?: string; // Keeping optional if needed, though we removed it from data
}

export const blogPosts: BlogPost[] = [
  baltimoreCampusPost,
  hospitalCampusPost,
  warehouseSafetyPost
];
