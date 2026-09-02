export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
}

export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  category: "UI/UX Strategy" | "Design Systems" | "Prototyping" | "Case Analysis" | "Career & Process" | string;
  tags: string[];
  author: BlogAuthor;
  date: string;
  readingTime: string;
  featured: boolean;
  published: boolean;
  order: number;
}

export const BLOG_CATEGORIES = [
  "All",
  "UI/UX Strategy",
  "Design Systems",
  "Prototyping",
  "Case Analysis",
  "Career & Process",
] as const;
