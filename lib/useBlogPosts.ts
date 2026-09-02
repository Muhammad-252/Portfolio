"use client";

import { useEffect, useState, useCallback } from "react";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db, firebaseConfigured } from "@/lib/firebase";
import type { BlogPost } from "./blogTypes";

export const DEFAULT_AUTHOR = {
  name: "Muhammad Arslan",
  role: "Lead UI/UX & Product Designer",
  avatar: "/images/hero-portrait-v3.png",
};

export const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    id: "scalable-figma-design-systems-2026",
    slug: "scalable-figma-design-systems",
    title: "The 2026 Guide to Scalable Figma Design Systems & Token Architectures",
    excerpt: "How modern product teams structure multi-brand variables, design tokens, and component sets to eliminate handoff friction between designers and engineers.",
    content: `Building a design system that survives past version 1.0 requires far more than just neatly organized auto-layout cards. In modern product organizations, a design system is not a library — it is an internal product, an operating system that bridges creative exploration and production code.

### 01. The Fallacy of Rigid Component Libraries
Too often, teams create massive UI component libraries that look pristine in Figma but fall apart in production. When edge cases arise — unexpected localized copy lengths, complex responsive breakpoints, or dark mode contrast requirements — engineers are forced to override styles, creating technical and visual debt.

To solve this, modern token architecture separates semantics into three distinct layers:
- **Global Primitive Tokens:** Raw values (\`#070707\`, \`16px\`, \`400\`).
- **Semantic Alias Tokens:** Purpose-bound variables (\`bg-surface-primary\`, \`space-component-gap\`).
- **Component-Specific Tokens:** Tight encapsulation (\`button-primary-hover-bg\`).

> *"A great design system does not restrict creativity; it liberates designers from repetitive decisions so they can focus on high-leverage user problems."*

### 02. Leveraging Figma Variables with Code Parity
With Figma's native variable system and component properties, design tokens can map 1-to-1 to CSS variables or Tailwind tokens. By synchronizing variable collections directly with GitHub actions via token transformers, any adjustment to a radius token or primary lime accent automatically creates an atomic pull request in the web repository.

### 03. Measuring Design System Adoption
The true metric of design system success is not the count of published Figma components, but the percentage of production code rendered using canonical components. Audit your codebase quarterly to identify rogue one-off hex colors and detached frames.`,
    cover: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1400&auto=format&fit=crop",
    category: "Design Systems",
    tags: ["Figma", "Design Tokens", "Design Systems", "Component Architecture"],
    author: DEFAULT_AUTHOR,
    date: "May 12, 2026",
    readingTime: "6 min read",
    featured: true,
    published: true,
    order: 1,
  },
  {
    id: "ux-psychology-micro-interactions",
    slug: "ux-psychology-micro-interactions",
    title: "UX Psychology: How Subtle Micro-Interactions Drive Conversion & User Trust",
    excerpt: "Why micro-animations, tactile feedback loops, and progressive disclosure elevate an interface from functional software to an emotionally satisfying product.",
    content: `When users interact with software, their perception of speed and reliability is largely subconscious. A digital product can be lightning-fast on the network layer, but if its interactive states feel stiff or unresponsive, users judge it as clunky.

### The Physics of Natural UI Motion
Real-world objects do not start and stop with mechanical linear velocity. They accelerate, encounter friction, and ease smoothly into place. By utilizing tailored cubic-bezier timing curves (\`cubic-bezier(0.16, 1, 0.3, 1)\`), interactive elements respond with tactile weight and poise.

Key touchpoints where micro-interactions transform usability:
1. **Button Loading States:** Instead of a generic spinning wheel, morphing the button into an indeterminate progress bar keeps user context intact.
2. **Form Validation Feedback:** Rather than harsh red errors appearing abruptly, subtle lateral shake motions communicate input rejection intuitively.
3. **Optimistic UI Updates:** Updating the interface immediately upon user tap while executing the background network sync creates an impression of zero latency.

> *"Perceived performance is reality in digital product design. When transitions feel alive, users forgive inevitable network delays."*

### Balancing Delight and Restraint
The golden rule of UI motion is purpose. If an animation calls attention to itself rather than guiding the user toward their objective, it is decorative noise. Every micro-transition must answer one of three questions: Where did this come from? Where did it go? What should I look at next?`,
    cover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop",
    category: "UI/UX Strategy",
    tags: ["Micro-interactions", "UX Psychology", "Motion Design", "Conversion"],
    author: DEFAULT_AUTHOR,
    date: "Apr 28, 2026",
    readingTime: "5 min read",
    featured: false,
    published: true,
    order: 2,
  },
  {
    id: "bridging-designer-engineer-gap",
    slug: "bridging-designer-engineer-gap",
    title: "Bridging the Gap: How Product Designers Can Think Like Frontend Engineers",
    excerpt: "Actionable frameworks for designers to communicate responsive constraints, flexbox layouts, and database state states without engineering friction.",
    content: `The most frequent friction point in digital product development happens during the designer-to-developer handoff. Designers complain that the finished product doesn't match the Figma file, while engineers complain that the designs failed to account for loading states, empty lists, or dynamic screen dimensions.

### Think in Box Models, Not Static Canvas Coordinates
When designing in Figma, auto-layout isn't just a layout convenience — it is an accurate simulation of CSS Flexbox and CSS Grid. Designers who understand container constraints, flex-grow ratios, and min/max dimensions design interfaces that translate seamlessly into clean code.

Essential states every designer must specify before handoff:
- **Default State:** Pristine data with ideal copy length.
- **Empty State:** First-time user onboarding with an encouraging call to action.
- **Overflow State:** Extremely long internationalized titles and localized text.
- **Loading Skeleton State:** Visual placeholders that mirror the final typography hierarchy.
- **Error / Offline State:** Actionable retry pathways with helpful system explanations.

### Shared Language Over Lengthy Documentation
Instead of exporting static 50-page design spec PDFs, product designers should sit alongside engineers during sprint planning. When you speak in terms of component states, props, and design tokens, handoff transforms from a wall-passing exercise into a collaborative craft.`,
    cover: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop",
    category: "Career & Process",
    tags: ["Collaboration", "Frontend", "Engineering", "Handoff"],
    author: DEFAULT_AUTHOR,
    date: "Apr 14, 2026",
    readingTime: "7 min read",
    featured: false,
    published: true,
    order: 3,
  },
  {
    id: "designing-high-density-web-apps",
    slug: "designing-high-density-web-apps",
    title: "Designing for High-Density Web Apps & Data-Intensive Enterprise Workflows",
    excerpt: "Balancing visual clarity, keyboard accessibility, and information hierarchy when designing enterprise software, dashboards, and financial tools.",
    content: `Designing enterprise software is a fundamentally different discipline than designing consumer marketing websites. In B2B SaaS, power users spend eight hours a day inside your application. For them, generous 80px white space and huge decorative illustrations are an impedance; speed of data entry, keyboard shortcuts, and visible data density are paramount.

### The Anatomy of High-Density Hierarchy
When displaying hundreds of data rows or complex financial graphs, visual noise is your primary enemy. Use subtle line dividers (\`1px solid rgba(255,255,255,0.06)\`) rather than heavy alternating row backgrounds. 

Key strategies for data-dense UX:
- **Monospace Number Alignments:** Always align numerical values to the right with tabular figures (\`font-variant-numeric: tabular-nums\`) so users can compare magnitudes down columns at a glance.
- **Keyboard-First Navigation:** Support arrow-key table navigation, modal dismissals via \`Escape\`, and search focus via \`Cmd + K\`.
- **Progressive Information Disclosure:** Surface primary indicators directly on the table row, but expose historical logs and granular properties inside an expandable drawer or flyout inspector.`,
    cover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop",
    category: "Case Analysis",
    tags: ["Enterprise UX", "SaaS", "Dashboard Design", "Data Visualization"],
    author: DEFAULT_AUTHOR,
    date: "Mar 30, 2026",
    readingTime: "6 min read",
    featured: false,
    published: true,
    order: 4,
  },
  {
    id: "why-product-redesigns-fail",
    slug: "why-product-redesigns-fail",
    title: "Why 90% of Product Redesigns Fail (And How to Prevent It)",
    excerpt: "The psychological bias of the 'Grand Redesign' and why continuous iterative evolutionary refinement beats rip-and-replace overhauls every time.",
    content: `Every few years, product teams fall into the siren song of the total redesign. The legacy codebase feels messy, the UI looks dated, and executive leadership wants a bold statement. Yet history is littered with famous redesign disasters that sparked user revolts, decimated conversion rates, and cost companies millions.

### The Cost of Resetting User Muscle Memory
When you change everything at once, you erase years of accumulated user habits. Even if your new navigation architecture is objectively cleaner, users will perceive it as broken because their daily workflows have been disrupted.

### The Evolutionary Redesign Framework
Instead of spending nine months behind closed doors building a 'Big Bang' launch, elite teams practice continuous evolutionary redesigns:
1. **Identify Bottlenecks with Analytics:** Isolate the single screen with the highest drop-off rate (e.g. the checkout funnel or filter facet).
2. **A/B Test Atomic Changes:** Modernize one component at a time, validating that user completion rates improve before moving to the next.
3. **Maintain Visual Continuity:** Keep primary actions in familiar visual quadrants while refining typography, contrast, and performance underneath.`,
    cover: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1400&auto=format&fit=crop",
    category: "Prototyping",
    tags: ["Product Strategy", "Redesign", "Analytics", "UX Audit"],
    author: DEFAULT_AUTHOR,
    date: "Mar 18, 2026",
    readingTime: "5 min read",
    featured: false,
    published: true,
    order: 5,
  },
];

const LOCAL_STORAGE_BLOG_KEY = "portfolio_blog_posts_v1";

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>(SAMPLE_BLOG_POSTS);
  const [loading, setLoading] = useState(true);

  // Read initial from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_BLOG_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPosts(parsed);
          }
        }
      } catch (e) {
        console.warn("Could not read blog posts from localStorage", e);
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
      const q = query(collection(db, "posts"), orderBy("order", "asc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched = snapshot.docs.map((d) => ({
              ...d.data(),
              id: d.id,
            })) as BlogPost[];
            setPosts(fetched);
            if (typeof window !== "undefined") {
              localStorage.setItem(LOCAL_STORAGE_BLOG_KEY, JSON.stringify(fetched));
            }
          }
          setLoading(false);
        },
        (err) => {
          console.warn("Firestore posts listener error, using local data", err);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn("Failed to subscribe to posts collection", e);
      setLoading(false);
    }
  }, []);

  // Persistence helper
  const persistPosts = useCallback(async (updated: BlogPost[]) => {
    setPosts(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_BLOG_KEY, JSON.stringify(updated));
    }
  }, []);

  // Add Blog Post
  const addBlogPost = useCallback(
    async (newPost: Omit<BlogPost, "id">): Promise<boolean> => {
      const postWithId: BlogPost = {
        ...newPost,
        id: "post-" + Date.now(),
      };

      if (firebaseConfigured && db) {
        try {
          const docRef = doc(collection(db, "posts"));
          postWithId.id = docRef.id;
          await setDoc(docRef, postWithId);
        } catch (e) {
          console.error("Firestore add post failed:", e);
        }
      }

      const updated = [postWithId, ...posts];
      await persistPosts(updated);
      return true;
    },
    [posts, persistPosts]
  );

  // Update Blog Post
  const updateBlogPost = useCallback(
    async (id: string, patch: Partial<BlogPost>): Promise<boolean> => {
      if (firebaseConfigured && db) {
        try {
          await setDoc(doc(db, "posts", id), patch, { merge: true });
        } catch (e) {
          console.error("Firestore update post failed:", e);
        }
      }

      const updated = posts.map((p) => (p.id === id ? { ...p, ...patch } : p));
      await persistPosts(updated);
      return true;
    },
    [posts, persistPosts]
  );

  // Delete Blog Post
  const deleteBlogPost = useCallback(
    async (id: string): Promise<boolean> => {
      if (firebaseConfigured && db) {
        try {
          await deleteDoc(doc(db, "posts", id));
        } catch (e) {
          console.error("Firestore delete post failed:", e);
        }
      }

      const updated = posts.filter((p) => p.id !== id);
      await persistPosts(updated);
      return true;
    },
    [posts, persistPosts]
  );

  // Reset to default sample posts
  const resetBlogPosts = useCallback(async () => {
    await persistPosts(SAMPLE_BLOG_POSTS);
  }, [persistPosts]);

  return {
    posts,
    loading,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    resetBlogPosts,
  };
}
