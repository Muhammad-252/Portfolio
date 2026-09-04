export type ProjectCategory = "UI/UX Design" | "WordPress" | "Webflow" | string;

export type ProjectPlatform = "Website" | "Web App" | "Mobile App" | string;

export interface IndustryItem {
  id?: string;
  name: string;
  slug?: string;
  createdAt?: number;
}

export type Project = {
  id?: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  industry: string;
  platform: ProjectPlatform;
  year: string;
  description: string;
  cover: string;
  gallery: string[];
  role: string;
  client: string;
  duration: string;
  tools: string[];
  challenge: string;
  process: string;
  solution: string;
  outcome: string;
  figma: string;
  live: string;
  featured: boolean;
  published: boolean;
  order: number;
  // Enhanced Case Study & SEO Fields
  overview?: string;
  userExperience?: string;
  keyFeatures?: string[];
  designSystem?: string;
  prototypeInteractions?: string;
  seoTitle?: string;
  seoDescription?: string;
  socialImage?: string;
};
