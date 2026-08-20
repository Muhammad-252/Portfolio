"use client";

import { useMemo, useState } from "react";
import Nav from "@/components/Nav";
import ProjectCard from "@/components/ProjectCard";
import { demoProjects } from "@/lib/projects";

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = useMemo(() => ["All", ...Array.from(new Set(demoProjects.map(project => project.category)))], []);
  const projects = activeFilter === "All" ? demoProjects : demoProjects.filter(project => project.category === activeFilter);
  return <><Nav /><main className="container work-page"><div className="work-page-intro"><div className="kicker">Portfolio</div><h1>All work.</h1><p>A selection of product interfaces, websites and visual systems created with strategy, craft and usability in mind.</p></div><div className="filters" aria-label="Filter work">{filters.map(filter => <button type="button" key={filter} className={activeFilter === filter ? "filter active" : "filter"} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><div className="projects work-grid">{projects.map(project => <ProjectCard key={project.id} p={project} />)}</div></main></>;
}
