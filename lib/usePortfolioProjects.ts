"use client";

import { useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { Project } from "@/lib/types";
import { SAMPLE_PROJECTS } from "./portfolioData";

export { SAMPLE_PROJECTS };

function normalizeCategory(category?: string): string {
  if (!category || category === "UI/UX") return "UI/UX Design";
  return category;
}

function normalizePlatform(platform?: string): string {
  if (!platform) return "Web App";
  return platform;
}

function tidyProject(data: Partial<Project>, id: string): Project {
  const sample = SAMPLE_PROJECTS.find(
    (p) => p.id === id || (data.slug && p.slug === data.slug)
  );

  const cover =
    data.cover && data.cover.trim() !== ""
      ? data.cover
      : sample?.cover || "";

  const gallery =
    Array.isArray(data.gallery) && data.gallery.length > 0
      ? data.gallery
      : sample?.gallery || [];

  const figma =
    data.figma && data.figma.trim() !== ""
      ? data.figma
      : sample?.figma || "";

  const live =
    data.live && data.live.trim() !== ""
      ? data.live
      : sample?.live || "";

  return {
    ...sample,
    ...data,
    id,
    title: data.title || sample?.title || "Untitled project",
    slug: data.slug || sample?.slug || id,
    category: normalizeCategory(data.category || sample?.category),
    industry: data.industry || sample?.industry || "Real Estate",
    platform: normalizePlatform(data.platform || sample?.platform),
    year: data.year || sample?.year || "2026",
    description: data.description || sample?.description || "",
    cover,
    gallery,
    role: data.role || sample?.role || "",
    client: data.client || sample?.client || "",
    duration: data.duration || sample?.duration || "",
    tools: Array.isArray(data.tools) && data.tools.length > 0 ? data.tools : sample?.tools || [],
    challenge: data.challenge || sample?.challenge || "",
    process: data.process || sample?.process || "",
    solution: data.solution || sample?.solution || "",
    outcome: data.outcome || sample?.outcome || "",
    figma,
    live,
    featured: typeof data.featured === "boolean" ? data.featured : Boolean(sample?.featured),
    published: data.published !== false,
    order: Number(data.order !== undefined && data.order !== null ? data.order : sample?.order || 0),
    overview: data.overview || sample?.overview || "",
    userExperience: data.userExperience || sample?.userExperience || "",
    keyFeatures: Array.isArray(data.keyFeatures) && data.keyFeatures.length > 0 ? data.keyFeatures : sample?.keyFeatures || [],
    designSystem: data.designSystem || sample?.designSystem || "",
    prototypeInteractions: data.prototypeInteractions || sample?.prototypeInteractions || "",
    seoTitle: data.seoTitle || sample?.seoTitle || `${data.title || sample?.title} | UI/UX Design & Development`,
    seoDescription: data.seoDescription || sample?.seoDescription || data.description || sample?.description || "",
    socialImage: data.socialImage || sample?.socialImage || cover || "",
  };
}

export function usePortfolioProjects() {
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);

  useEffect(() => {
    if (!supabaseConfigured) {
      setProjects(SAMPLE_PROJECTS);
      return;
    }

    let isMounted = true;

    async function fetchProjects() {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("order", { ascending: true });

        if (!isMounted) return;

        if (error || !data || data.length === 0) {
          setProjects(SAMPLE_PROJECTS);
          return;
        }

        const saved = data
          .map((item: any) => tidyProject(item, item.id))
          .filter((project: Project) => project.published)
          .sort((a: Project, b: Project) => a.order - b.order);

        setProjects(saved.length > 0 ? saved : SAMPLE_PROJECTS);
      } catch (error) {
        console.warn(
          "Notice fetching projects from Supabase, fallback to sample projects:",
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