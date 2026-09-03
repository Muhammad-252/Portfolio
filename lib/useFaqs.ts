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
    id: "faq-process-1",
    question: "What is your typical end-to-end design process?",
    answer: "My process is divided into 4 structured phases: 01 Discovery & Research (analyzing your business goals, target audience, and competitive landscape), 02 Architecture & Wireframing (mapping intuitive user flows and low-fidelity structure), 03 High-Fidelity UI & Prototyping (crafting bespoke design systems, responsive interfaces, and interactive Figma prototypes), and 04 Developer Handoff & QA (supplying tokenized specs, component states, and conducting visual QA during engineering).",
    category: "Process",
    order: 1,
    published: true,
  },
  {
    id: "faq-timeline-2",
    question: "How long does a standard project take to complete?",
    answer: "Project timelines depend on the scope and complexity: a focused marketing website or conversion landing page typically takes 2–3 weeks, while a comprehensive web application, SaaS dashboard, or multi-platform MVP generally spans 6–10 weeks. Every project is broken into clear milestones with weekly progress demos so there are never surprises.",
    category: "Timeline & Pricing",
    order: 2,
    published: true,
  },
  {
    id: "faq-dev-3",
    question: "Do you handle development or strictly UI/UX design?",
    answer: "Both! Having a Software Engineering background enables me to design with deep technical empathy. I build production-grade websites in Webflow, WordPress, and Framer, and for custom web applications, I can deliver production-ready Next.js/React frontends or collaborate hand-in-hand with your internal engineering team to ensure 100% design fidelity.",
    category: "Deliverables",
    order: 3,
    published: true,
  },
  {
    id: "faq-deliverables-4",
    question: "What deliverables and Figma assets do I receive upon completion?",
    answer: "You receive full ownership of an organized, production-grade Figma project including: complete design tokens (colors, typography, spacing variables, dark/light modes), auto-layout component library with interactive states, responsive desktop and mobile screen layouts, clickable user-flow prototypes, and optimized vector/image assets.",
    category: "Deliverables",
    order: 4,
    published: true,
  },
  {
    id: "faq-collab-5",
    question: "How do we communicate and review progress during the project?",
    answer: "We communicate through a dedicated Slack or WhatsApp channel for daily updates, questions, and rapid feedback loops, alongside weekly video checkpoints (Google Meet or Zoom) to walk through design iterations. You will also have live view and commenting access in Figma throughout the entire engagement.",
    category: "Collaboration",
    order: 5,
    published: true,
  },
  {
    id: "faq-audit-6",
    question: "Can you audit or redesign an existing digital product?",
    answer: "Absolutely. I frequently conduct UX Audits on active products to diagnose drop-off points, confusing navigation, visual inconsistency, and mobile responsiveness issues. I deliver an actionable heuristic report detailing immediate quick wins alongside a strategic redesign proposal.",
    category: "Process",
    order: 6,
    published: true,
  },
];

const LOCAL_STORAGE_FAQS_KEY = "portfolio_faqs_v1";

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
