"use client";

import { useMemo, useState } from "react";
import Nav from "@/components/Nav";
import ProjectCard from "@/components/ProjectCard";
import { usePortfolioProjects } from "@/lib/usePortfolioProjects";

export default function WorkPage() {
  const [category, setCategory] = useState("All");
  const [industry, setIndustry] = useState("All industries");
  const projects = usePortfolioProjects();
  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(projects.map((project) => project.category))),
    ],
    [projects],
  );
  const industries = useMemo(
    () => [
      "All industries",
      ...Array.from(
        new Set(projects.map((project) => project.industry).filter(Boolean)),
      ),
    ],
    [projects],
  );
  const visibleProjects = projects.filter(
    (project) =>
      (category === "All" || project.category === category) &&
      (industry === "All industries" || project.industry === industry),
  );
  return (
    <>
      <Nav />
      <main className="container work-page">
        <div className="work-page-intro">
          <div className="kicker">Portfolio</div>
          <h1>All work.</h1>
          <p>
            A selection of product interfaces, websites and visual systems
            created with strategy, craft and usability in mind.
          </p>
        </div>
        <div className="filter-panel">
          <div className="filters" aria-label="Filter work by category">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={category === item ? "filter active" : "filter"}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="industry-filter">
            Industry
            <select
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
            >
              {industries.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="projects work-grid">
          {visibleProjects.map((project) => (
            <ProjectCard key={project.id || project.slug} p={project} />
          ))}
        </div>
        {!visibleProjects.length && (
          <p className="notice">No projects match these filters yet.</p>
        )}
      </main>
    </>
  );
}
