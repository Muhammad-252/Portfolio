"use client";

import { useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowUpRight,
  ArrowLeft,
  Sparkles,
  Layers,
  CheckCircle2,
  ExternalLink,
  Code2,
  Palette,
  Eye,
  MonitorSmartphone,
} from "lucide-react";
import { usePortfolioProjects } from "@/lib/usePortfolioProjects";
import ProjectGallery from "@/components/ProjectGallery";
import CaseStudyFloatingCTA from "@/components/CaseStudyFloatingCTA";
import ProjectCard from "@/components/ProjectCard";
import Footer from "@/components/Footer";
import BlobButton from "@/components/ui/BlobButton";
import { sanitizeJsonLd, sanitizeUrl } from "@/lib/security";

export default function CaseStudyPage() {
  const params = useParams<{ slug: string }>();
  const projects = usePortfolioProjects();

  const project = useMemo(() => {
    return projects.find((item) => item.slug === params.slug);
  }, [projects, params.slug]);

  const relatedProjects = useMemo(() => {
    if (!project) return [];
    return projects
      .filter((p) => p.slug !== project.slug && p.published)
      .slice(0, 2);
  }, [projects, project]);

  useEffect(() => {
    if (project) {
      const pageTitle =
        project.seoTitle ||
        `${project.title} | ${project.category} Case Study — Muhammad Arslan`;
      document.title = pageTitle;
    }
  }, [project]);

  if (!project) {
    return (
      <main className="container case" style={{ padding: "120px 0", textAlign: "center" }}>
        <p className="notice">Loading case study details…</p>
        <div style={{ marginTop: 24 }}>
          <Link href="/work" className="pill">
            ← Return to All Work
          </Link>
        </div>
      </main>
    );
  }

  const safeLive = sanitizeUrl(project.live, "#");
  const safeFigma = sanitizeUrl(project.figma, "#");
  const hasFigma = safeFigma !== "#";
  const hasLiveSite = safeLive !== "#";
  const coverUrl = project.cover?.startsWith("//")
    ? "https:" + project.cover
    : project.cover || "/images/project-placeholder.svg";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.seoDescription || project.description,
    image: coverUrl,
    creator: {
      "@type": "Person",
      name: "Muhammad Arslan",
      jobTitle: "UI/UX Designer & Webflow Developer",
      url: "https://www.muhammadarslan.com",
    },
    genre: project.category,
    keywords: [
      project.category,
      project.industry,
      project.platform,
      "UI/UX Design",
      "Case Study",
    ].join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(jsonLd) }}
      />

      <header className="container nav case-nav">
        <Link href="/" className="logo" aria-label="Muhammad Arslan Home">
          ARSLAN<i>.</i>
        </Link>
        <div className="case-nav-actions">
          <BlobButton href="/work" variant="secondary" size="sm">
            <ArrowLeft size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
            <span>All Work</span>
          </BlobButton>
          <BlobButton href="/contact" variant="primary" size="sm">
            <span>Inquire</span>
            <ArrowUpRight size={14} />
          </BlobButton>
        </div>
      </header>

      <main className="container case case-study-detailed">
        {/* 1. Project Hero */}
        <section className="case-hero">
          <div className="case-summary">
            <div className="case-badge-cluster">
              <span className="badge badge-category">{project.category}</span>
              <span className="badge badge-industry">{project.industry}</span>
              <span className="badge badge-platform">{project.platform}</span>
            </div>

            <h1 className="case-hero-h1">{project.title}</h1>
            <p className="case-hero-desc">{project.description}</p>

            <div className="case-meta-bar">
              <div className="meta-item">
                <small>Timeline</small>
                <b>{project.year}</b>
              </div>
              <div className="meta-item">
                <small>Role</small>
                <b>{project.role}</b>
              </div>
              <div className="meta-item">
                <small>Client</small>
                <b>{project.client}</b>
              </div>
              <div className="meta-item">
                <small>Duration</small>
                <b>{project.duration}</b>
              </div>
            </div>

            <div className="case-hero-actions">
              {hasLiveSite && (
                <BlobButton
                  variant="primary"
                  size="md"
                  href={safeLive}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Live Project</span>
                  <ArrowUpRight size={15} />
                </BlobButton>
              )}
              {hasFigma && (
                <BlobButton
                  variant="secondary"
                  size="md"
                  href={safeFigma}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>Figma Preview</span>
                  <ExternalLink size={14} />
                </BlobButton>
              )}
            </div>
          </div>

          <div className="case-cover">
            <img
              src={coverUrl}
              alt={`${project.title} ${project.platform} design showcase cover`}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src && !target.src.endsWith("/images/project-placeholder.svg")) {
                  target.src = "/images/project-placeholder.svg";
                }
              }}
            />
            <div className="case-cover-sheen" />
            <div className="case-cover-label">
              <span>{project.industry}</span>
              <strong>{project.year}</strong>
            </div>
          </div>
        </section>

        {/* Tools & Environment Ribbon */}
        <section className="case-tools-ribbon" aria-label="Technologies and methods used">
          <span className="ribbon-label">Tools &amp; Methods:</span>
          <div className="ribbon-chips">
            {project.tools.map((t) => (
              <span key={t} className="tool-chip">
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* 2. Project Overview */}
        {project.overview && (
          <section className="case-section case-overview-block">
            <div className="case-section-kicker">
              <div className="kicker">Context</div>
              <h2>Project Overview</h2>
            </div>
            <div className="case-prose-lead">
              <p>{project.overview}</p>
            </div>
          </section>
        )}

        {/* 3. The Challenge & 4. My Approach & 5. The Solution */}
        <section className="case-section case-narrative-triad">
          <div className="narrative-card">
            <div className="narrative-index">01</div>
            <h3>The Challenge</h3>
            <p>{project.challenge}</p>
          </div>

          <div className="narrative-card">
            <div className="narrative-index">02</div>
            <h3>My Approach</h3>
            <p>{project.process}</p>
          </div>

          <div className="narrative-card">
            <div className="narrative-index">03</div>
            <h3>The Solution</h3>
            <p>{project.solution}</p>
          </div>
        </section>

        {/* 6. User Experience */}
        {project.userExperience && (
          <section className="case-section case-ux-block">
            <div className="case-section-kicker">
              <div className="kicker">Human-Centered Architecture</div>
              <h2>User Experience &amp; Interaction Decisions</h2>
            </div>
            <div className="case-prose-card">
              <p>{project.userExperience}</p>
            </div>
          </section>
        )}

        {/* 7. Key Features */}
        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <section className="case-section case-features-block">
            <div className="case-section-kicker">
              <div className="kicker">Functionality</div>
              <h2>Key Product Features</h2>
            </div>
            <div className="case-features-grid">
              {project.keyFeatures.map((feat, idx) => (
                <div key={idx} className="case-feature-item">
                  <CheckCircle2 size={18} className="feature-check" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. Design System & 9. Prototype & Interactions */}
        {(project.designSystem || project.prototypeInteractions) && (
          <section className="case-section case-systems-grid">
            {project.designSystem && (
              <div className="systems-card">
                <div className="systems-header">
                  <Palette size={18} />
                  <h3>Design System &amp; Tokens</h3>
                </div>
                <p>{project.designSystem}</p>
              </div>
            )}

            {project.prototypeInteractions && (
              <div className="systems-card">
                <div className="systems-header">
                  <Sparkles size={18} />
                  <h3>Prototype &amp; Micro-Interactions</h3>
                </div>
                <p>{project.prototypeInteractions}</p>
              </div>
            )}
          </section>
        )}

        {/* 10. Outcome */}
        <section className="case-section case-outcome-block">
          <div className="case-section-kicker">
            <div className="kicker">Validation &amp; Impact</div>
            <h2>Project Outcome</h2>
          </div>
          <div className="outcome-banner">
            <div className="outcome-icon-orb">
              <CheckCircle2 size={24} />
            </div>
            <div className="outcome-content">
              <h4>Real-World Results</h4>
              <p>{project.outcome}</p>
            </div>
          </div>
        </section>

        {/* 11. Project Gallery (Circular 3D Showcase & Modal) */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="case-section case-gallery-section" aria-label="Project Visual Gallery">
            <ProjectGallery
              images={project.gallery}
              title={project.title}
              platform={project.platform}
              slug={project.slug}
            />
          </section>
        )}

        {/* 12. Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="case-section case-related-section">
            <div className="section-head">
              <div>
                <div className="kicker">Selected Work</div>
                <h2>Explore More Projects</h2>
              </div>
              <div className="section-head-side">
                <BlobButton href="/work" variant="secondary" size="md">
                  <span>View All Case Studies</span>
                  <ArrowUpRight size={15} />
                </BlobButton>
              </div>
            </div>

            <div className="projects work-grid" style={{ marginTop: 24 }}>
              {relatedProjects.map((rel) => (
                <ProjectCard key={rel.id || rel.slug} p={rel} />
              ))}
            </div>
          </section>
        )}

        {/* 13. Case Study End CTA */}
        <section className="case-bottom-cta-section">
          <div className="cta">
            <div className="kicker">Have a Similar Challenge?</div>
            <h2>Let’s create something that works for your business.</h2>
            <p style={{ maxWidth: 580, margin: "16px auto 26px", color: "var(--muted)" }}>
              I’m available for freelance UI/UX design, Webflow development, and full product design contracts.
            </p>
            <div className="actions" style={{ justifyContent: "center" }}>
              <BlobButton
                variant="primary"
                size="lg"
                href={`/contact?ref=${encodeURIComponent(project.title)}`}
              >
                <span>Let&apos;s Work Together</span>
                <ArrowUpRight size={16} />
              </BlobButton>
              <BlobButton variant="secondary" size="lg" href="/work">
                <span>View More Work</span>
                <ArrowUpRight size={16} />
              </BlobButton>
            </div>
          </div>
        </section>
      </main>

      {/* Floating CTA (Desktop Floating Card & Mobile Sticky Bottom) */}
      <CaseStudyFloatingCTA projectTitle={project.title} />

      <Footer />
    </>
  );
}
