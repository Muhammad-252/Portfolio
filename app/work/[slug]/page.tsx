"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { usePortfolioProjects } from "@/lib/usePortfolioProjects";
import ProjectGallery from "@/components/ProjectGallery";
import CaseStudyFloatingCTA from "@/components/CaseStudyFloatingCTA";

export default function CaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const projects = usePortfolioProjects();
  const project = projects.find((item) => item.slug === params.slug);
  if (!project)
    return (
      <main className="container case">
        <p className="notice">Loading project…</p>
      </main>
    );
  const hasFigma = project.figma && project.figma !== "#";
  const hasLiveSite = project.live && project.live !== "#";
  const coverUrl = project.cover?.startsWith("//")
    ? "https:" + project.cover
    : project.cover || "/images/hero-portrait-v3.png";

  return (
    <>
      <header className="container nav case-nav">
        <Link href="/" className="logo">
          ARSLAN<i>.</i>
        </Link>
        <Link href="/work" className="pill">
          ← All work
        </Link>
      </header>
      <main className="container case">
        <section className="case-hero">
          <div className="case-summary">
            <div className="kicker">Case study · {project.category}</div>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <div className="case-year">{project.year}</div>
          </div>
          <div className="case-cover">
            <img
              src={coverUrl}
              alt={project.title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "/images/hero-portrait-v3.png";
              }}
            />
            <div className="case-cover-label">
              Selected work
              <br />
              <strong>{project.year}</strong>
            </div>
          </div>
        </section>
        <section className="case-info">
          {[
            ["Role", project.role],
            ["Client", project.client],
            ["Duration", project.duration],
            ["Tools", project.tools.join(" · ")],
          ].map((item) => (
            <div className="info" key={item[0]}>
              <small>{item[0]}</small>
              <b>{item[1]}</b>
            </div>
          ))}
        </section>
        <section className="case-story">
          <div className="case-story-label">
            <div className="kicker">Behind the work</div>
            <span>01—04</span>
          </div>
          <article className="case-body">
            <div>
              <span className="case-number">01</span>
              <h2>The challenge</h2>
              <p>{project.challenge}</p>
            </div>
            <div>
              <span className="case-number">02</span>
              <h2>My approach</h2>
              <p>{project.process}</p>
            </div>
            <div>
              <span className="case-number">03</span>
              <h2>The solution</h2>
              <p>{project.solution}</p>
            </div>
            <div>
              <span className="case-number">04</span>
              <h2>Outcome</h2>
              <p>{project.outcome}</p>
            </div>
            <div className="case-actions">
              {hasFigma && (
                <a
                  className="pill"
                  href={project.figma}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Figma <ArrowUpRight size={16} />
                </a>
              )}
              {hasLiveSite && (
                <a
                  className="pill primary"
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                >
                  View live project <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </article>
        </section>
        <ProjectGallery images={project.gallery} />
      </main>
      <CaseStudyFloatingCTA projectTitle={project.title} />
    </>
  );
}
