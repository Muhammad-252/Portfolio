"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, firebaseConfigured } from "@/lib/firebase";
import type { Project } from "@/lib/types";

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: "estate-flow-pro",
    title: "EstateFlow — Luxury Real Estate Portal",
    slug: "estateflow-real-estate",
    category: "UI/UX Design",
    industry: "Real Estate",
    platform: "Web App",
    year: "2026",
    description: "An intuitive high-end real estate portal connecting property buyers with verified luxury residences and 3D virtual staging.",
    cover: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1400&auto=format&fit=crop"
    ],
    role: "Lead Product Designer",
    client: "EstateFlow Global",
    duration: "8 Weeks",
    tools: ["Figma", "Design System", "Prototyping", "User Research"],
    challenge: "Traditional property search was cluttered, slow, and lacked interactive visual spatial context.",
    process: "Conducted 15 user interviews with property investors and designed an interactive map-first discovery feed with instant filters.",
    solution: "A minimalist, responsive web app featuring high-resolution galleries, neighborhood insights, and rapid filter facets.",
    outcome: "42% increase in listing inquiry conversion and 2.4x higher session engagement.",
    figma: "https://figma.com",
    live: "https://example.com",
    featured: true,
    published: true,
    order: 1,
  },
  {
    id: "mediconnect-health",
    title: "MediPulse — Telehealth Patient Companion",
    slug: "medipulse-telehealth",
    category: "UI/UX Design",
    industry: "Healthcare",
    platform: "Mobile App",
    year: "2026",
    description: "A patient-centric mobile application for instant specialist consultations, prescription tracking, and biometric sync.",
    cover: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1400&auto=format&fit=crop"
    ],
    role: "Senior UI/UX Designer",
    client: "MediPulse Labs",
    duration: "10 Weeks",
    tools: ["Figma", "iOS Human Interface", "User Testing"],
    challenge: "Patients over 50 struggled with complex multi-step booking flows and small font tap targets.",
    process: "Mapped accessibility-first touch targets, high contrast palettes, and a 2-tap doctor appointment flow.",
    solution: "An ergonomic mobile application with voice search, clear medication reminders, and secure video calls.",
    outcome: "98% appointment completion rate with over 150,000 active monthly patients.",
    figma: "https://figma.com",
    live: "https://example.com",
    featured: true,
    published: true,
    order: 2,
  },
  {
    id: "artisan-commerce",
    title: "LuxeCraft — Bespoke E-Commerce Store",
    slug: "luxecraft-ecommerce",
    category: "WordPress",
    industry: "E-commerce",
    platform: "Website",
    year: "2025",
    description: "High-conversion WooCommerce store engineered for custom handcrafted luxury watches and leather goods.",
    cover: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1400&auto=format&fit=crop"
    ],
    role: "WordPress & UI Specialist",
    client: "LuxeCraft Atelier",
    duration: "6 Weeks",
    tools: ["WordPress", "WooCommerce", "Figma", "CSS3"],
    challenge: "Slow page load times and fragmented checkout flow caused high cart abandonment.",
    process: "Designed a clean aesthetic with streamlined 1-page checkout and responsive product visualizer.",
    solution: "Custom WordPress theme optimized for sub-second speeds, smooth micro-interactions, and global currencies.",
    outcome: "35% drop in cart abandonment and $1.2M in first-quarter sales.",
    figma: "https://figma.com",
    live: "https://example.com",
    featured: true,
    published: true,
    order: 3,
  },
  {
    id: "cloudscale-saas",
    title: "CloudScale — AI Analytics Dashboard",
    slug: "cloudscale-ai-analytics",
    category: "Webflow",
    industry: "SaaS",
    platform: "Website",
    year: "2025",
    description: "Marketing website and interactive product demo built for an enterprise AI infrastructure startup.",
    cover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop"
    ],
    role: "Webflow Developer & Designer",
    client: "CloudScale Systems",
    duration: "4 Weeks",
    tools: ["Webflow", "GSAP", "Figma", "Client-First"],
    challenge: "Explaining intricate ML telemetry to non-technical enterprise buyers.",
    process: "Built interactive 3D component showcases and interactive ROI calculators directly inside Webflow.",
    solution: "A dynamic Webflow site featuring sleek dark mode aesthetics, interactive previews, and responsive CMS.",
    outcome: "Doubled inbound demo requests within 30 days of launch.",
    figma: "https://figma.com",
    live: "https://example.com",
    featured: false,
    published: true,
    order: 4,
  },
  {
    id: "finova-wealth",
    title: "Finova — Automated Wealth & Portfolio Manager",
    slug: "finova-wealth-management",
    category: "UI/UX Design",
    industry: "FinTech",
    platform: "Web App",
    year: "2026",
    description: "Institutional-grade portfolio management and algorithmic asset rebalancing web application.",
    cover: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1400&auto=format&fit=crop"
    ],
    role: "Lead UI/UX Architect",
    client: "Finova Capital",
    duration: "12 Weeks",
    tools: ["Figma", "Data Viz", "Fintech UX"],
    challenge: "Displaying dense algorithmic financial metrics without overwhelming retail investors.",
    process: "Implemented progressive disclosure, personalized risk dashboards, and dark-mode data visualization.",
    solution: "Clean, responsive web app with customizable widgets, real-time gain/loss tracking, and bank integration.",
    outcome: "Secured $5M Series A following the MVP design launch.",
    figma: "https://figma.com",
    live: "https://example.com",
    featured: false,
    published: true,
    order: 5,
  },
  {
    id: "edusmart-academy",
    title: "EduVantage — Hybrid Learning LMS",
    slug: "eduvantage-lms",
    category: "WordPress",
    industry: "Education & Training",
    platform: "Website",
    year: "2025",
    description: "A comprehensive video-course and live workshop learning platform for corporate professional certifications.",
    cover: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1400&auto=format&fit=crop"
    ],
    role: "WordPress Architect",
    client: "EduVantage Group",
    duration: "5 Weeks",
    tools: ["WordPress", "LearnDash", "Figma", "Custom CSS"],
    challenge: "Migrating 200+ hours of video lessons into a unified, distraction-free study portal.",
    process: "Architected modern chapter navigation, progress bars, quiz engines, and instant digital certificates.",
    solution: "High-performance WordPress platform with student dashboards and enterprise team licenses.",
    outcome: "Over 40,000 course completions in the first 6 months.",
    figma: "https://figma.com",
    live: "https://example.com",
    featured: false,
    published: true,
    order: 6,
  }
];

function normalizeCategory(category?: string): string {
  if (!category || category === "UI/UX") return "UI/UX Design";
  return category;
}

function normalizePlatform(platform?: string): string {
  if (!platform) return "Web App";
  return platform;
}

function tidyProject(data: Partial<Project>, id: string): Project {
  return {
    ...data,
    id,
    title: data.title || "Untitled project",
    slug: data.slug || id,
    category: normalizeCategory(data.category),
    industry: data.industry || "Real Estate",
    platform: normalizePlatform(data.platform),
    year: data.year || "2026",
    description: data.description || "",
    cover: data.cover || "",
    gallery: Array.isArray(data.gallery) ? data.gallery : [],
    role: data.role || "",
    client: data.client || "",
    duration: data.duration || "",
    tools: Array.isArray(data.tools) ? data.tools : [],
    challenge: data.challenge || "",
    process: data.process || "",
    solution: data.solution || "",
    outcome: data.outcome || "",
    figma: data.figma || "",
    live: data.live || "",
    featured: Boolean(data.featured),
    published: data.published !== false,
    order: Number(data.order || 0),
  };
}

export function usePortfolioProjects() {
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);

  useEffect(() => {
    if (!firebaseConfigured || !db) {
      setProjects(SAMPLE_PROJECTS);
      return;
    }

    try {
      const unsubscribe = onSnapshot(
        collection(db, "projects"),
        (snapshot) => {
          if (snapshot.empty) {
            setProjects(SAMPLE_PROJECTS);
            return;
          }

          const saved = snapshot.docs
            .map((item) => tidyProject(item.data() as Partial<Project>, item.id))
            .filter((project) => project.published)
            .sort((a, b) => a.order - b.order);

          setProjects(saved.length > 0 ? saved : SAMPLE_PROJECTS);
        },
        (error) => {
          console.error("Error fetching projects from Firestore, fallback to sample projects:", error);
          setProjects(SAMPLE_PROJECTS);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.error("Firestore snapshot setup failed:", e);
      setProjects(SAMPLE_PROJECTS);
    }
  }, []);

  return projects;
}