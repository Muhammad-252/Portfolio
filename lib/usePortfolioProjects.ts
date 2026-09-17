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