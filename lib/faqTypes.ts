export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "Process" | "Timeline & Pricing" | "Deliverables" | "Collaboration" | string;
  order: number;
  published: boolean;
}

export const FAQ_CATEGORIES = [
  "All",
  "Process",
  "Timeline & Pricing",
  "Deliverables",
  "Collaboration",
] as const;
