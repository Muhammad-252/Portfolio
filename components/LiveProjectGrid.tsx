"use client";

import ProjectCard from "@/components/ProjectCard";
import { usePortfolioProjects } from "@/lib/usePortfolioProjects";

export default function LiveProjectGrid({ limit }: { limit?: number }) {
  const projects = usePortfolioProjects();
  const visibleProjects = limit ? projects.slice(0, limit) : projects;
  return <div className="projects">{visibleProjects.map((project) => <ProjectCard key={project.id || project.slug} p={project} />)}</div>;
}
