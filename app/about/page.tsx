import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BlobButton from "@/components/ui/BlobButton";
import {
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Layers,
  Code2,
  Palette,
  Compass,
  Monitor,
  Smartphone,
  Briefcase,
  Building2,
  Workflow,
  Search,
  Target,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Muhammad Arslan | UI/UX Designer & Webflow Developer",
  description:
    "Learn more about Muhammad Arslan, a UI/UX designer and no-code developer with 3+ years of experience crafting intuitive interfaces, scalable design systems, and high-performance Webflow & WordPress sites.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Muhammad Arslan | UI/UX Designer & Webflow Developer",
    description:
      "3+ years of experience turning complex business requirements into intuitive, engaging digital products for startups and established businesses.",
    url: "/about",
  },
};

export default function AboutPage() {
  const skillsUIUX = [
    "UI/UX Design",
    "UX Research",
    "User Flows",
    "Wireframing",
    "High-Fidelity UI",
    "Design Systems",
    "Prototyping",
    "Interaction Design",
    "Responsive Design",
  ];

  const skillsDev = [
    "Webflow",
    "WordPress",
    "CMS",
    "Responsive Development",
    "Website Development",
    "Integrations",
    "CSS Flexbox & Grid",
    "Client-First System",
  ];

  const skillsProduct = [
    "SaaS Platforms",
    "Dashboards & Data Viz",
    "Web Applications",
    "Mobile Apps (iOS & Android)",
    "Marketplaces",
    "E-commerce",
  ];

  const industries = [
    "SaaS & Cloud Software",
    "Real Estate & PropTech",
    "Healthcare & Telehealth",
    "E-commerce & Retail",
    "FinTech & Wealth Management",
    "Education & EdTech",
    "Logistics & Supply Chain",
    "Media & Creative Agencies",
  ];

  const tools = [
    "Figma",
    "Webflow",
    "WordPress",
    "Framer",
    "Shopify",
    "Adobe Creative Cloud",
    "Miro",
    "Notion",
    "HTML5 / CSS3",
    "Git",
  ];

  return (
    <>
      <Nav />
      <main id="main-content" className="about-page-root">
        {/* Hero Header */}
        <section className="container about-hero-section">
          <div className="about-hero-grid">
            <div className="about-hero-text">
              <div className="hero-kicker-row">
                <div className="kicker">About Muhammad Arslan</div>
                <span className="hero-availability-badge">
                  <span className="live-pulse-dot" /> 3+ Years Crafting Products
                </span>
              </div>

              <h1 className="about-main-h1">
                Designing Digital Experiences With Purpose.
              </h1>

              <p className="about-hero-lead">
                I’m a UI/UX designer and no-code developer who helps startups,
                agencies, and established businesses create intuitive interfaces,
                scalable design systems, and high-converting Webflow &amp; WordPress
                websites.
              </p>

              <div className="actions" style={{ marginTop: 28 }}>
                <BlobButton variant="primary" size="lg" href="/contact">
                  <span>Start a Project</span>
                  <ArrowUpRight size={17} />
                </BlobButton>
                <BlobButton variant="secondary" size="lg" href="/work">
                  <span>View Case Studies</span>
                  <ArrowUpRight size={17} />
                </BlobButton>
              </div>
            </div>

            <div className="about-hero-image-box">
              <div className="about-portrait-card">
                <img
                  src="/images/hero-portrait-v3.png"
                  alt="Muhammad Arslan working on digital product design"
                  className="about-portrait-img"
                  width={540}
                  height={640}
                />
                <div className="about-portrait-overlay">
                  <strong>Muhammad Arslan</strong>
                  <span>UI/UX Designer · Webflow &amp; WordPress Developer</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience & Background Section */}
        <section className="container section about-experience-section">
          <div className="split">
            <div>
              <div className="kicker">Experience &amp; Background</div>
              <h2>
                A Hybrid Mindset:
                <br />
                Design Vision + Engineering Rigor.
              </h2>
            </div>
            <div className="about-copy">
              <p>
                My journey in tech began with software engineering principles, giving me a
                concrete understanding of the browser document tree, responsive layout
                engines, and database structures.
              </p>
              <p>
                When I transitioned into product design, this technical foundation became my
                biggest asset. Rather than designing decorative screens that can never be
                feasibly built, I design with technical empathy—ensuring token structures,
                component variants, and interaction states transition seamlessly into
                production code.
              </p>
              <p>
                Over the past 3+ years, I have collaborated directly with founders, product
                managers, and engineering teams across the globe, designing intuitive web
                apps, mobile interfaces, and conversion-optimized websites.
              </p>
            </div>
          </div>

          <div className="facts" style={{ marginTop: 45 }}>
            <div className="fact">
              <b>3+</b>
              <span>Years of experience</span>
            </div>
            <div className="fact">
              <b>50+</b>
              <span>Completed projects</span>
            </div>
            <div className="fact">
              <b>13+</b>
              <span>Industries served</span>
            </div>
            <div className="fact">
              <b>100%</b>
              <span>Pixel-accurate delivery</span>
            </div>
          </div>
        </section>

        {/* Design Philosophy Section */}
        <section className="container section about-philosophy-section">
          <div className="section-head">
            <div>
              <div className="kicker">Design Philosophy</div>
              <h2>How I Think About Digital Products.</h2>
            </div>
            <div className="section-head-side">
              <p>
                Design is not just visual ornamentation. It is an iterative
                problem-solving discipline that harmonizes business revenue goals with human
                usability.
              </p>
            </div>
          </div>

          <div className="value-pillars-grid">
            <div className="value-pillar-card">
              <div className="pillar-icon-box">
                <Compass size={20} />
              </div>
              <h3>Clarity Over Novelty</h3>
              <p>
                If a user cannot understand how to navigate your interface within three
                seconds, visual flair will not save it. I prioritize clear mental models,
                intuitive information hierarchy, and cognitive ease.
              </p>
            </div>

            <div className="value-pillar-card">
              <div className="pillar-icon-box">
                <Layers size={20} />
              </div>
              <h3>Systematic Scalability</h3>
              <p>
                Great products are built on systematic design tokens, reusable UI
                components, and accessible color palettes that empower teams to ship features
                without introducing visual inconsistency.
              </p>
            </div>

            <div className="value-pillar-card">
              <div className="pillar-icon-box">
                <Code2 size={20} />
              </div>
              <h3>Production Feasibility</h3>
              <p>
                A Figma concept is only as valuable as its live implementation. I design
                with strict CSS box model rules, clean Auto Layout, and responsive breakpoints
                so engineering handoff is frictionless.
              </p>
            </div>

            <div className="value-pillar-card">
              <div className="pillar-icon-box">
                <Briefcase size={20} />
              </div>
              <h3>Business Alignment</h3>
              <p>
                Every design decision should support a tangible business goal—increasing
                onboarding completion, reducing customer support tickets, or elevating
                landing page conversion rates.
              </p>
            </div>
          </div>
        </section>

        {/* Skills Breakdown Section */}
        <section className="container section about-skills-section">
          <div className="section-head">
            <div>
              <div className="kicker">Core Expertise</div>
              <h2>Skills &amp; Capabilities.</h2>
            </div>
            <div className="section-head-side">
              <p>
                A comprehensive overview of my technical capabilities spanning UX
                strategy, visual UI design, and production frontend development.
              </p>
            </div>
          </div>

          <div className="skills-three-column-grid">
            {/* Column 1: UI/UX Design */}
            <div className="skills-column-card">
              <div className="skills-column-header">
                <Palette size={20} className="skills-col-icon" />
                <h3>UI/UX Design</h3>
              </div>
              <p className="skills-column-desc">
                From user research and mental models to polished, high-fidelity interfaces
                and interactive prototypes.
              </p>
              <ul className="skills-tag-list">
                {skillsUIUX.map((s) => (
                  <li key={s} className="skill-item-pill">
                    <CheckCircle2 size={13} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Development */}
            <div className="skills-column-card">
              <div className="skills-column-header">
                <Code2 size={20} className="skills-col-icon" />
                <h3>Development</h3>
              </div>
              <p className="skills-column-desc">
                Bringing Figma designs to life with responsive Webflow and WordPress
                builds, clean CMS structures, and animations.
              </p>
              <ul className="skills-tag-list">
                {skillsDev.map((s) => (
                  <li key={s} className="skill-item-pill">
                    <CheckCircle2 size={13} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Product Design */}
            <div className="skills-column-card">
              <div className="skills-column-header">
                <Layers size={20} className="skills-col-icon" />
                <h3>Product Design</h3>
              </div>
              <p className="skills-column-desc">
                End-to-end design thinking for multi-screen applications, complex SaaS
                dashboards, and high-conversion platforms.
              </p>
              <ul className="skills-tag-list">
                {skillsProduct.map((s) => (
                  <li key={s} className="skill-item-pill">
                    <CheckCircle2 size={13} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="container section about-tools-section">
          <div className="section-head">
            <div>
              <div className="kicker">Toolbox</div>
              <h2>Tools &amp; Environment.</h2>
            </div>
          </div>
          <div className="tools">
            {tools.map((t) => (
              <span className="tool" key={t}>
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Industries Served */}
        <section className="container section about-industries-section">
          <div className="section-head">
            <div>
              <div className="kicker">Industry Experience</div>
              <h2>Domains I Work Across.</h2>
            </div>
            <div className="section-head-side">
              <p>
                Deep domain familiarity with distinct compliance needs, user expectations,
                and conversion models.
              </p>
            </div>
          </div>

          <div className="industries-badges-grid">
            {industries.map((ind) => (
              <div className="industry-badge-card" key={ind}>
                <Building2 size={16} />
                <span>{ind}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="container section about-process-section">
          <div className="section-head">
            <div>
              <div className="kicker">Proven Workflow</div>
              <h2>From Idea to Launch.</h2>
            </div>
            <div className="section-head-side">
              <p>
                A structured, transparent workflow ensuring complete clarity at every stage
                of collaboration.
              </p>
            </div>
          </div>

          <div className="process-flow-grid">
            {[
              {
                num: "01",
                title: "Discover",
                desc: "Understand the business, users, goals, requirements, and constraints.",
                tag: "Strategy & Audit",
                icon: <Search size={18} />,
              },
              {
                num: "02",
                title: "Define",
                desc: "Map user journeys, information architecture, and product requirements.",
                tag: "Journeys & Scoping",
                icon: <Target size={18} />,
              },
              {
                num: "03",
                title: "Design",
                desc: "Create wireframes, interfaces, design systems, and interactive prototypes.",
                tag: "Figma UI & Systems",
                icon: <Palette size={18} />,
              },
              {
                num: "04",
                title: "Build",
                desc: "Turn approved designs into responsive Webflow or WordPress experiences.",
                tag: "Clean Development",
                icon: <Code2 size={18} />,
              },
              {
                num: "05",
                title: "Refine",
                desc: "Test, iterate, optimize, and prepare the product for launch.",
                tag: "QA & Launch Ready",
                icon: <CheckCircle2 size={18} />,
              },
            ].map((step) => (
              <div className="process-card workflow-card" key={step.num}>
                <div className="process-top-row">
                  <span className="process-number">{step.num}</span>
                  <div className="process-icon-wrap">{step.icon}</div>
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                <div className="process-card-footer">
                  <span className="process-tag-pill">{step.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final Conversion CTA */}
        <section className="container section about-cta-section">
          <div className="cta">
            <div className="kicker">Let&apos;s Build Together</div>
            <h2>Need a seasoned designer for your next project?</h2>
            <p style={{ maxWidth: 580, margin: "16px auto 26px", color: "var(--muted)" }}>
              Whether you are an early-stage startup looking for a founding designer, or an
              established company seeking a modern website, I’d love to hear about your goals.
            </p>
            <div className="actions" style={{ justifyContent: "center" }}>
              <BlobButton variant="primary" size="lg" href="/contact">
                <span>Start a Conversation</span>
                <ArrowUpRight size={17} />
              </BlobButton>
              <BlobButton variant="secondary" size="lg" href="/work">
                <span>Explore Selected Work</span>
                <ArrowUpRight size={17} />
              </BlobButton>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
