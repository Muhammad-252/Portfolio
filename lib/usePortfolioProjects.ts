"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, firebaseConfigured } from "@/lib/firebase";
import type { Project } from "@/lib/types";

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: "propreel-ai-video",
    title: "PropReel — AI-Powered Real Estate Video Platform",
    slug: "propreel",
    category: "UI/UX Design",
    industry: "Real Estate",
    platform: "Web App",
    year: "2026",
    description:
      "PropReel is an AI-powered real estate video platform designed to help real estate professionals transform property listings into engaging, professional-quality videos while reducing the time and effort required for property marketing.",
    overview:
      "PropReel automates video asset generation for commercial and residential realtors. The platform ingests MLS data, high-resolution photography, and architectural floorplans, synthesizing them into dynamic social and listing video reels with natural AI narration and automated cinematic camera moves.",
    cover:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1400&auto=format&fit=crop",
    ],
    role: "Lead UI/UX & Product Designer",
    client: "PropReel Technologies",
    duration: "10 Weeks",
    tools: ["Figma", "Design System", "User Research", "Framer Prototyping"],
    challenge:
      "Real estate agents spend hours manually coordinating videographers or struggling with complicated video editing software. The client needed an intuitive dashboard where non-technical agents could generate, customize, and export studio-grade property videos in under 3 minutes.",
    process:
      "Conducted 12 exploratory interviews with realtors and brokers to understand their weekly listing workflow. Designed low-fidelity wireframes exploring timeline editors versus automated preset templates. Discovered that realtors prioritized automated template presets over granular timeline manipulation, leading to a modular card-based composition flow.",
    solution:
      "Architected a step-by-step video creation wizard featuring real-time preview canvas, drag-and-drop scene ordering, customizable branding palettes, and one-click export to Instagram Reels, TikTok, and YouTube Shorts.",
    userExperience:
      "Focus was placed on progressive disclosure: high-level options (script tone, music style, video format) are presented upfront, while advanced audio ducking, subtitle typography, and transition pacing remain accessible via collapsible side drawers.",
    keyFeatures: [
      "Automated MLS listing sync and photo extraction",
      "Real-time interactive video playback preview in browser",
      "Custom brand kit presets (typography, logos, agency colors)",
      "Multi-format export (9:16 vertical, 16:9 widescreen, 1:1 square)",
      "Automated AI voiceover script generation with accent selection",
    ],
    designSystem:
      "Built a dark-mode-first design system in Figma with 8pt spatial grid, fluid typography tokens, high-contrast accessible states, and a customized set of video timeline and media control components.",
    prototypeInteractions:
      "Created high-fidelity Figma and Framer prototypes demonstrating the video generation loading states, timeline trimming micro-interactions, and instant template switching.",
    outcome:
      "Realtors tested reported creating ready-to-publish listing videos in an average of 2.8 minutes compared to previous 4-hour editing workflows.",
    figma: "https://figma.com",
    live: "https://example.com",
    featured: true,
    published: true,
    order: 1,
    seoTitle: "PropReel — AI-Powered Real Estate Video Platform | UI/UX Design",
    seoDescription:
      "PropReel is an AI-powered real estate video platform designed to help real estate professionals transform property listings into engaging, professional-quality videos while reducing the time and effort required for property marketing.",
  },
  {
    id: "estate-flow-pro",
    title: "EstateFlow — Luxury Real Estate Portal",
    slug: "estateflow-real-estate",
    category: "UI/UX Design",
    industry: "Real Estate",
    platform: "Web App",
    year: "2026",
    description:
      "An intuitive high-end real estate portal connecting property buyers with verified luxury residences and 3D virtual staging.",
    overview:
      "EstateFlow is a specialized luxury property portal engineered for international high-net-worth investors seeking premium residential and commercial developments.",
    cover:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1400&auto=format&fit=crop",
    ],
    role: "Lead Product Designer",
    client: "EstateFlow Global",
    duration: "8 Weeks",
    tools: ["Figma", "Design System", "Prototyping", "User Research"],
    challenge:
      "Traditional property portals were cluttered, slow, and lacked spatial visual context for international buyers unable to tour properties in person.",
    process:
      "Interviewed real estate investors and mapped an interactive map-first discovery feed with instant spatial filters and full-screen architectural photography.",
    solution:
      "A minimalist, responsive web app featuring high-resolution galleries, neighborhood insights, interactive mortgage calculators, and direct broker chat.",
    userExperience:
      "Clean visual cards with subtle elevation, generous whitespace, and instant keyboard shortcuts for navigating photo galleries.",
    keyFeatures: [
      "Interactive map view with boundary and school district overlays",
      "Full-screen 3D virtual staging and floorplan viewer",
      "Instant inquiry and private private viewing scheduler",
      "Currency and measurement unit converter",
    ],
    designSystem:
      "Monochrome editorial typography paired with subtle champagne gold accents and fluid layout containers.",
    prototypeInteractions:
      "Seamless map-to-card hover synchronization and smooth slide-over property specification sheets.",
    outcome:
      "Delivered a design system and 35+ responsive screens validated by investor usability testing.",
    figma: "https://figma.com",
    live: "https://example.com",
    featured: true,
    published: true,
    order: 2,
  },
  {
    id: "mediconnect-health",
    title: "MediPulse — Telehealth Patient Companion",
    slug: "medipulse-telehealth",
    category: "UI/UX Design",
    industry: "Healthcare",
    platform: "Mobile App",
    year: "2026",
    description:
      "A patient-centric mobile application for instant specialist consultations, prescription tracking, and biometric sync.",
    overview:
      "MediPulse bridges the gap between remote patients and medical specialists with secure video visits, intuitive medical records access, and automated medication reminders.",
    cover:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1400&auto=format&fit=crop",
    ],
    role: "Senior UI/UX Designer",
    client: "MediPulse Labs",
    duration: "10 Weeks",
    tools: ["Figma", "iOS Human Interface", "User Testing"],
    challenge:
      "Patients over 50 struggled with complex multi-step booking flows, low contrast labels, and confusing medical jargon on existing health portals.",
    process:
      "Conducted usability testing across diverse age demographics to establish accessibility-first touch targets and high-contrast color pairings conforming to WCAG AAA.",
    solution:
      "An ergonomic mobile application with simplified 2-step doctor booking, voice search, clear pill reminders, and end-to-end encrypted video calls.",
    userExperience:
      "Thumb-friendly bottom navigation, large tap targets (minimum 48px), and gentle reassuring microcopy throughout stressful triage moments.",
    keyFeatures: [
      "2-tap doctor appointment scheduling",
      "Digital prescription wallet and pharmacy fulfillment",
      "Health vitals dashboard with Apple Health / Google Fit sync",
      "In-app telemedicine video consultation room",
    ],
    designSystem:
      "Calming medical cyan and slate color palette designed for high contrast and calm cognitive experience.",
    prototypeInteractions:
      "Smooth calendar drawer transitions and tactile haptic feedback during appointment confirmation.",
    outcome:
      "Received clinical advisory approval and achieved a 98% user task completion rate in testing.",
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
    description:
      "Marketing website and interactive product demo built for an enterprise AI infrastructure startup.",
    overview:
      "CloudScale provides machine learning telemetry for engineering teams. The marketing website needed to communicate complex cloud infrastructure simply and convert enterprise buyers.",
    cover:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop",
    ],
    role: "Webflow Developer & Designer",
    client: "CloudScale Systems",
    duration: "4 Weeks",
    tools: ["Webflow", "GSAP", "Figma", "Client-First"],
    challenge:
      "Explaining intricate ML telemetry and distributed compute to non-technical enterprise buyers without boring or overwhelming them.",
    process:
      "Designed interactive ROI calculators and interactive component showcases in Figma, then built them in Webflow using lightweight GSAP transforms.",
    solution:
      "A dynamic Webflow site featuring sleek dark mode aesthetics, interactive preview tabs, and scalable CMS for case studies and blog documentation.",
    userExperience:
      "Smooth scroll-triggered animations revealing architectural diagrams progressively as the user scrolls down the landing page.",
    keyFeatures: [
      "Interactive ROI savings calculator",
      "Dynamic CMS collections for changelogs and documentation",
      "Client-First modular class structure for easy in-house updates",
      "Sub-second page load times with global Fastly edge delivery",
    ],
    designSystem:
      "Deep obsidian background (#0a0a0c) accented with high-chroma electric indigo and lime indicators.",
    prototypeInteractions:
      "Hardware-accelerated CSS hover states and interactive interactive dashboard toggle previews.",
    outcome:
      "Successfully launched on product roadmap, achieving a 98/100 Core Web Vitals score on mobile and desktop.",
    figma: "https://figma.com",
    live: "https://example.com",
    featured: false,
    published: true,
    order: 4,
  },
  {
    id: "artisan-commerce",
    title: "LuxeCraft — Bespoke E-Commerce Store",
    slug: "luxecraft-ecommerce",
    category: "WordPress",
    industry: "E-commerce",
    platform: "Website",
    year: "2025",
    description:
      "High-conversion WooCommerce store engineered for custom handcrafted luxury watches and leather goods.",
    overview:
      "LuxeCraft Atelier creates bespoke handcrafted goods. The e-commerce experience needed to reflect the craftsmanship of their physical products.",
    cover:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1400&auto=format&fit=crop",
    ],
    role: "WordPress & UI Specialist",
    client: "LuxeCraft Atelier",
    duration: "6 Weeks",
    tools: ["WordPress", "WooCommerce", "Figma", "CSS3"],
    challenge:
      "Slow page loads and fragmented multi-step checkout caused cart abandonment on mobile devices.",
    process:
      "Redesigned the complete shopping funnel in Figma with a 1-page checkout flow, product zoom visualizer, and streamlined filter system.",
    solution:
      "Custom lightweight WordPress theme optimized for sub-second speeds, smooth micro-interactions, and multi-currency checkout.",
    userExperience:
      "Distraction-free checkout with clear progress indicators and sticky add-to-cart controls on mobile viewports.",
    keyFeatures: [
      "Custom 1-page WooCommerce checkout",
      "Interactive product colorway and leather strap customizer",
      "Speed-optimized custom Gutenberg product blocks",
      "Global currency and automated tax calculation",
    ],
    designSystem:
      "Warm neutral editorial aesthetic utilizing bespoke serif typography and warm parchment card backgrounds.",
    prototypeInteractions:
      "Micro-animations on cart drawer slide-in and hover magnification on handcrafted product details.",
    outcome:
      "Streamlined shopping funnel resulted in a smooth checkout flow and responsive product presentation.",
    figma: "https://figma.com",
    live: "https://example.com",
    featured: true,
    published: true,
    order: 5,
  },
  {
    id: "finova-wealth",
    title: "Finova — Automated Wealth & Portfolio Manager",
    slug: "finova-wealth-management",
    category: "UI/UX Design",
    industry: "FinTech",
    platform: "Web App",
    year: "2026",
    description:
      "Institutional-grade portfolio management and algorithmic asset rebalancing web application.",
    overview:
      "Finova provides automated algorithmic asset management for modern investors, integrating real-time market data and automated tax-loss harvesting.",
    cover:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1400&auto=format&fit=crop",
    ],
    role: "Lead UI/UX Architect",
    client: "Finova Capital",
    duration: "12 Weeks",
    tools: ["Figma", "Data Viz", "Fintech UX"],
    challenge:
      "Displaying dense algorithmic financial metrics without overwhelming retail investors who want clean actionable insights.",
    process:
      "Implemented progressive disclosure, personalized risk tolerance dashboards, and clear dark-mode data visualization.",
    solution:
      "Clean, responsive web app with customizable widgets, real-time gain/loss tracking, and bank integration.",
    userExperience:
      "Interactive charts with customizable time horizons, tooltips for financial jargon, and immediate trade confirmation modals.",
    keyFeatures: [
      "Customizable portfolio breakdown donut and area charts",
      "Automated rebalancing rule builder",
      "Integrated bank account sync via Plaid APIs",
      "Exportable tax audit reports and ledger history",
    ],
    designSystem:
      "Emerald green gain indicators, slate borders, and monospace numeric tables for scannability.",
    prototypeInteractions:
      "Drag-and-drop dashboard widget rearrangement and smooth drilldown into individual asset classes.",
    outcome:
      "Completed comprehensive UI architecture enabling the client to pitch institutional investors with confidence.",
    figma: "https://figma.com",
    live: "https://example.com",
    featured: false,
    published: true,
    order: 6,
  },
  {
    id: "edusmart-academy",
    title: "EduVantage — Hybrid Learning LMS",
    slug: "eduvantage-lms",
    category: "WordPress",
    industry: "Education & Training",
    platform: "Website",
    year: "2025",
    description:
      "A comprehensive video-course and live workshop learning platform for corporate professional certifications.",
    overview:
      "EduVantage is a corporate learning portal delivering accredited professional certifications and interactive video modules for global teams.",
    cover:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1400&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1400&auto=format&fit=crop",
    ],
    role: "WordPress Architect",
    client: "EduVantage Group",
    duration: "5 Weeks",
    tools: ["WordPress", "LearnDash", "Figma", "Custom CSS"],
    challenge:
      "Migrating 200+ hours of video lessons into a unified, distraction-free study portal with smooth progress tracking.",
    process:
      "Architected modern chapter navigation, progress bars, quiz engines, and instant digital certificate verification.",
    solution:
      "High-performance WordPress platform with student dashboards, video bookmarking, and team license management.",
    userExperience:
      "Distraction-free theater mode for video lectures with collapsible curriculum sidebars and auto-saving quiz progress.",
    keyFeatures: [
      "Distraction-free lesson video theater mode",
      "Automated PDF certificate generation upon completion",
      "Instructor gradebook and live webinar integration",
      "Team license management and seat allocation",
    ],
    designSystem:
      "Modern clean typography with indigo accents and high-legibility body font sizes for prolonged reading.",
    prototypeInteractions:
      "Interactive quiz state transitions and celebratory animated completion checkmarks.",
    outcome:
      "Delivered a stable, responsive LMS platform now hosting thousands of active corporate learners.",
    figma: "https://figma.com",
    live: "https://example.com",
    featured: false,
    published: true,
    order: 7,
  },
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
    overview: data.overview || "",
    userExperience: data.userExperience || "",
    keyFeatures: Array.isArray(data.keyFeatures) ? data.keyFeatures : [],
    designSystem: data.designSystem || "",
    prototypeInteractions: data.prototypeInteractions || "",
    seoTitle: data.seoTitle || `${data.title} | UI/UX Design & Development`,
    seoDescription: data.seoDescription || data.description || "",
    socialImage: data.socialImage || data.cover || "",
  };
}

export function usePortfolioProjects() {
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);

  useEffect(() => {
    if (!firebaseConfigured || !db) {
      setProjects(SAMPLE_PROJECTS);
      return;
    }

    let isMounted = true;

    async function fetchProjects() {
      try {
        const snapshot = await getDocs(collection(db, "projects"));
        if (!isMounted) return;

        if (snapshot.empty) {
          setProjects(SAMPLE_PROJECTS);
          return;
        }

        const saved = snapshot.docs
          .map((item) => tidyProject(item.data() as Partial<Project>, item.id))
          .filter((project) => project.published)
          .sort((a, b) => a.order - b.order);

        setProjects(saved.length > 0 ? saved : SAMPLE_PROJECTS);
      } catch (error) {
        console.warn(
          "Notice fetching projects from Firestore, fallback to sample projects:",
          error
        );
        if (isMounted) {
          setProjects(SAMPLE_PROJECTS);
        }
      }
    }

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return projects;
}