"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, firebaseConfigured } from "@/lib/firebase";
import type { FAQItem } from "./faqTypes";

export const SAMPLE_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "What does a UI/UX designer do?",
    answer:
      "A UI/UX designer solves problems by understanding users, their workflows, and business objectives. I conduct user research, design intuitive information architectures and wireframes, create high-fidelity visual interfaces with comprehensive design systems, and build interactive prototypes to test usability before engineering begins.",
    category: "General",
    order: 1,
    published: true,
  },
  {
    id: "faq-2",
    question: "How much does a UI/UX design project cost?",
    answer:
      "Project investments depend on the scope, number of unique templates or screens, and complexity of features. Focused landing pages or UX audits typically start around $1,000–$2,500, while end-to-end web applications, SaaS dashboards, or full website design-to-build projects range between $3,000 and $8,000+. I offer clear fixed-price milestone billing with no hidden surprises.",
    category: "Timeline & Pricing",
    order: 2,
    published: true,
  },
  {
    id: "faq-3",
    question: "Do you design websites and web applications?",
    answer:
      "Yes. I design both marketing websites (focused on brand positioning, storytelling, and lead conversion) and complex web applications/SaaS platforms (focused on data density, workflow efficiency, dashboard analytics, and user retention).",
    category: "Deliverables",
    order: 3,
    published: true,
  },
  {
    id: "faq-4",
    question: "Do you provide Webflow development?",
    answer:
      "Yes. I build custom, responsive Webflow websites directly from high-fidelity Figma designs using the Client-First naming system. This includes custom CMS collections, responsive layouts, micro-interactions, and on-page editor training so your team can publish content independently.",
    category: "Deliverables",
    order: 4,
    published: true,
  },
  {
    id: "faq-5",
    question: "Do you provide WordPress development?",
    answer:
      "Yes. I specialize in custom, lightweight WordPress development utilizing modern Gutenberg block themes or clean custom code. I eliminate plugin bloat, optimize Core Web Vitals for sub-second speeds, and configure WooCommerce or custom post types tailored to your exact business needs.",
    category: "Deliverables",
    order: 5,
    published: true,
  },
  {
    id: "faq-6",
    question: "Can you design and develop a complete website?",
    answer:
      "Yes. Providing an end-to-end design and build service is one of my greatest strengths. Because I handle both UX/UI design and Webflow or WordPress development, you eliminate handoff friction, mismatched specifications, and redundant agency coordination.",
    category: "Process",
    order: 6,
    published: true,
  },
  {
    id: "faq-7",
    question: "Can you work with an existing Figma design?",
    answer:
      "Absolutely. If you already have approved Figma wireframes or visual designs, I can review them for responsive edge cases and develop them into a pixel-perfect, accessible Webflow or WordPress website.",
    category: "Process",
    order: 7,
    published: true,
  },
  {
    id: "faq-8",
    question: "How long does a typical project take?",
    answer:
      "A focused landing page or marketing website typically takes 2–3 weeks. A complete multi-page marketing website with CMS setup takes 3–5 weeks, and an end-to-end web application or SaaS platform redesign generally spans 6–10 weeks depending on feature complexity.",
    category: "Timeline & Pricing",
    order: 8,
    published: true,
  },
  {
    id: "faq-9",
    question: "Do you work with startups?",
    answer:
      "Yes! A significant portion of my client work is with early-stage and venture-backed startups. I help founders translate ambiguous product concepts into testable MVPs, pitch-ready prototypes, and high-converting launch websites.",
    category: "General",
    order: 9,
    published: true,
  },
  {
    id: "faq-10",
    question: "Can you redesign an existing website or application?",
    answer:
      "Yes. I regularly conduct UX audits and comprehensive redesigns. We identify drop-off points, modernize dated visual aesthetics, establish a systematic component library, and improve mobile responsiveness without disrupting existing SEO equity.",
    category: "Process",
    order: 10,
    published: true,
  },
  {
    id: "faq-11",
    question: "Do you provide high-fidelity prototypes?",
    answer:
      "Yes. Every UI/UX project includes interactive, clickable prototypes in Figma. This allows stakeholders and prospective users to experience real interaction flows, micro-animations, and screen transitions before writing any code.",
    category: "Deliverables",
    order: 11,
    published: true,
  },
  {
    id: "faq-12",
    question: "How can I start a project with you?",
    answer:
      "Simply reach out via the Contact page or send an email to marslanprofessional@gmail.com with a short summary of your project, timeline, and goals. I’ll respond within 24 hours to schedule an introductory call and outline next steps.",
    category: "Collaboration",
    order: 12,
    published: true,
  },
];

const LOCAL_STORAGE_FAQS_KEY = "portfolio_faqs_v2";

export function useFaqs() {
  const [faqs, setFaqs] = useState<FAQItem[]>(SAMPLE_FAQS);
  const [loading, setLoading] = useState(true);

  // Load from localStorage initially
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_FAQS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFaqs(parsed);
          }
        }
      } catch (e) {
        console.warn("Could not read FAQs from localStorage", e);
      }
    }
  }, []);

  // Sync with Firestore if configured
  useEffect(() => {
    if (!firebaseConfigured || !db) {
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, "faqs"), orderBy("order", "asc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched = snapshot.docs.map((d) => ({
              ...d.data(),
              id: d.id,
            })) as FAQItem[];
            setFaqs(fetched);
            if (typeof window !== "undefined") {
              localStorage.setItem(LOCAL_STORAGE_FAQS_KEY, JSON.stringify(fetched));
            }
          }
          setLoading(false);
        },
        (err) => {
          if ((err as any)?.code !== "permission-denied") {
            console.warn("Firestore faqs listener error, using local data", err);
          }
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn("Failed to subscribe to faqs collection", e);
      setLoading(false);
    }
  }, []);

  const persistFaqs = useCallback(async (updated: FAQItem[]) => {
    setFaqs(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_FAQS_KEY, JSON.stringify(updated));
    }
  }, []);

  // Add FAQ
  const addFaq = useCallback(
    async (item: Omit<FAQItem, "id">): Promise<boolean> => {
      const newFaq: FAQItem = {
        ...item,
        id: "faq-" + Date.now(),
      };

      if (firebaseConfigured && db) {
        try {
          const docRef = doc(collection(db, "faqs"));
          newFaq.id = docRef.id;
          await setDoc(docRef, newFaq);
        } catch (e) {
          console.error("Firestore add FAQ failed:", e);
        }
      }

      const updated = [...faqs, newFaq];
      await persistFaqs(updated);
      return true;
    },
    [faqs, persistFaqs]
  );

  // Update FAQ
  const updateFaq = useCallback(
    async (id: string, patch: Partial<FAQItem>): Promise<boolean> => {
      if (firebaseConfigured && db) {
        try {
          await setDoc(doc(db, "faqs", id), patch, { merge: true });
        } catch (e) {
          console.error("Firestore update FAQ failed:", e);
        }
      }

      const updated = faqs.map((f) => (f.id === id ? { ...f, ...patch } : f));
      await persistFaqs(updated);
      return true;
    },
    [faqs, persistFaqs]
  );

  // Delete FAQ
  const deleteFaq = useCallback(
    async (id: string): Promise<boolean> => {
      if (firebaseConfigured && db) {
        try {
          await deleteDoc(doc(db, "faqs", id));
        } catch (e) {
          console.error("Firestore delete FAQ failed:", e);
        }
      }

      const updated = faqs.filter((f) => f.id !== id);
      await persistFaqs(updated);
      return true;
    },
    [faqs, persistFaqs]
  );

  // Reset to default sample FAQs
  const resetFaqs = useCallback(async () => {
    await persistFaqs(SAMPLE_FAQS);
  }, [persistFaqs]);

  return {
    faqs,
    loading,
    addFaq,
    updateFaq,
    deleteFaq,
    resetFaqs,
  };
}
