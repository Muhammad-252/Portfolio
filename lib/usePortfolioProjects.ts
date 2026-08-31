"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, firebaseConfigured } from "@/lib/firebase";
import type { Project } from "@/lib/types";

function tidyProject(data: Partial<Project>, id: string): Project {
  return {
    ...data,
    id,
    title: data.title || "Untitled project",
    slug: data.slug || id,
    category: data.category || "UI/UX",
    industry: data.industry || "Other",
    year: data.year || "",
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
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!firebaseConfigured || !db) return;

    return onSnapshot(
      collection(db, "projects"),
      (snapshot) => {
        const saved = snapshot.docs
          .map((item) => tidyProject(item.data() as Partial<Project>, item.id))
          .filter((project) => project.published)
          .sort((a, b) => a.order - b.order);

        setProjects(saved);
      },
      (error) => {
        console.error("Error fetching projects:", error);
        setProjects([]);
      }
    );
  }, []);

  return projects;
}