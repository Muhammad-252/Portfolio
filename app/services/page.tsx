import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BlobButton from "@/components/ui/BlobButton";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Sparkles,
  Layers,
  Code2,
  Palette,
  Compass,
  MonitorSmartphone,
  ShieldCheck,
  Zap,
  Search,
  Target,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services | UI/UX Design & Web Development by Muhammad Arslan",
  description:
    "Explore UI/UX design, Webflow development, WordPress development, and digital product design services for startups, SaaS companies, and scaling businesses.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "UI/UX Design & Web Development Services | Muhammad Arslan",
    description:
      "Transforming complex ideas into intuitive digital products and high-quality websites.",
    url: "/services",
  },
};

export default function ServicesPage() {
  const services = [
    {
      id: "ui-ux-design",
      number: "01",
      title: "UI/UX Design",
      tagline: "Human-centered digital interfaces designed with clarity and purpose.",
      whatIProvide:
        "Comprehensive user research, persona definition, customer journey mapping, wireframes, high-fidelity responsive UI, interactive Figma prototypes, and complete design token systems.",
      whoItIsFor:
        "Startups building their MVP from scratch, SaaS companies revamping legacy portals, and brands seeking to fix low conversion rates or confusing UX.",
      deliverables: [
        "Interactive Clickable Prototypes (Figma)",
        "Responsive Desktop, Tablet & Mobile Layouts",
        "Comprehensive Design Tokens & Component Libraries",
        "User Flow Diagrams & Information Architecture",
        "Developer Handoff Specifications & Redlines",
      ],
      whyItMatters:
        "Visually striking interfaces are meaningless if users cannot navigate them intuitively. Thoughtful UX reduces churn, lowers customer support overhead, and creates lasting brand trust.",
      ctaText: "Inquire About UI/UX Design",
      relevantWorkFilter: "UI/UX Design",
    },
    {
      id: "webflow-development",
      number: "02",
      title: "Webflow Development",
      tagline: "Pixel-perfect, high-performance websites built from custom Figma designs.",
      whatIProvide:
        "Full-fidelity translation of Figma designs into clean, responsive Webflow sites using the Client-First naming system. Includes CMS collection modeling, bespoke interactions, SEO configuration, and third-party integrations.",
      whoItIsFor:
        "Marketing teams, tech startups, and design-led brands who require complete autonomy over their content without ongoing reliance on software engineers.",
      deliverables: [
        "100% Responsive Webflow Website",
        "Modular Client-First Class Architecture",
        "Dynamic CMS Collections with Editor Access",
        "Custom GSAP & Webflow Micro-Interactions",
        "Core Web Vitals & Technical SEO Optimization",
      ],
      whyItMatters:
        "Traditional web development is slow and creates engineering bottlenecks for marketing teams. Webflow provides total design freedom, enterprise-grade hosting, and lightning-fast publishing speed.",
      ctaText: "Inquire About Webflow Development",
      relevantWorkFilter: "Webflow",
    },
    {
      id: "wordpress-development",
      number: "03",
      title: "WordPress Development",
      tagline: "Custom, scalable WordPress architectures with zero plugin bloat.",
      whatIProvide:
        "Custom WordPress websites, bespoke Gutenberg block themes, flexible CMS content modeling, WooCommerce integrations, speed optimization, and secure third-party API connections.",
      whoItIsFor:
        "Businesses with established editorial archives, e-commerce stores, content publishers, and companies requiring robust database control and self-hosted ownership.",
      deliverables: [
        "Custom Lightweight WordPress Theme",
        "Custom Gutenberg Blocks & Full Site Editing",
        "WooCommerce Storefront & Checkout Flow",
        "Sub-second TTFB & Caching Optimization",
        "Automated Backups & Security Hardening",
      ],
      whyItMatters:
        "Many WordPress sites suffer from plugin bloat and agonizingly slow load times. I build lean, modern WordPress sites that pass Core Web Vitals and provide intuitive admin editing.",
      ctaText: "Inquire About WordPress Development",
      relevantWorkFilter: "WordPress",
    },
    {
      id: "product-design",
      number: "04",
      title: "Product Design",
      tagline: "End-to-end digital product design for complex web applications and SaaS platforms.",
      whatIProvide:
        "Strategic product thinking from discovery to launch. Designing multi-tenant dashboards, high-density analytics portals, user onboarding sequences, and cross-platform mobile apps.",
      whoItIsFor:
        "Founders, Product Managers, and CTOs building software platforms, enterprise SaaS, B2B portals, or multi-sided marketplaces.",
      deliverables: [
        "High-Density Dashboard Layouts & Data Viz",
        "Multi-State Interactive Components (Empty, Error, Loading)",
        "Onboarding & User Activation Sequences",
        "Design System Governance Documentation",
        "Mobile App UI for iOS & Android",
      ],
      whyItMatters:
        "Complex software often fails due to feature clutter and overwhelming cognitive load. Product design organizes complexity into clean, actionable steps that drive activation and long-term retention.",
      ctaText: "Inquire About Product Design",
      relevantWorkFilter: "UI/UX Design",
    },
  ];

  return (
    <>
      <Nav />
      <main id="main-content" className="services-page-root">
        {/* Page Hero */}
        <section className="container services-hero-section">
          <div className="services-hero-content">
            <div className="hero-kicker-row">
              <div className="kicker">Core Capabilities</div>
              <span className="hero-availability-badge">
                <span className="live-pulse-dot" /> End-to-End Execution
              </span>
            </div>

            <h1 className="services-main-h1">
              UI/UX Design &amp; Web Development Services
            </h1>

            <p className="services-hero-lead">
              I help startups, businesses, and product teams transform ideas into
              intuitive digital products and high-quality websites.
            </p>

            <div className="actions" style={{ marginTop: 28 }}>
              <BlobButton variant="primary" size="lg" href="/contact">
                <span>Start a Project</span>
                <ArrowUpRight size={17} />
              </BlobButton>
              <BlobButton variant="secondary" size="lg" href="/work">
                <span>See Relevant Work</span>
                <ArrowUpRight size={17} />
              </BlobButton>
            </div>
          </div>
        </section>

        {/* Detailed Services Breakdown */}
        <section className="container services-list-section" aria-label="Detailed service specifications">
          {services.map((srv) => (
            <article key={srv.id} id={srv.id} className="service-deep-card">
              <div className="service-deep-top">
                <span className="service-deep-number">{srv.number}</span>
                <div className="service-deep-title-wrap">
                  <h2>{srv.title}</h2>
                  <p className="service-deep-tagline">{srv.tagline}</p>
                </div>
              </div>

              <div className="service-deep-grid">
                {/* Column 1: What I provide & Who it is for */}
                <div className="service-deep-col">
                  <div className="service-detail-block">
                    <h4>What I Provide</h4>
                    <p>{srv.whatIProvide}</p>
                  </div>

                  <div className="service-detail-block">
                    <h4>Who It Is For</h4>
                    <p>{srv.whoItIsFor}</p>
                  </div>

                  <div className="service-detail-block">
                    <h4>Why It Matters</h4>
                    <p>{srv.whyItMatters}</p>
                  </div>
                </div>

                {/* Column 2: Deliverables & CTA */}
                <div className="service-deep-col service-deliverables-col">
                  <h4>Typical Deliverables</h4>
                  <ul className="service-deliverables-list">
                    {srv.deliverables.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={16} className="deliverable-check-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="service-card-action-cluster">
                    <BlobButton
                      href={`/contact?service=${encodeURIComponent(srv.title)}`}
                      variant="primary"
                      size="md"
                      className="service-action-pill"
                    >
                      <span>{srv.ctaText}</span>
                      <ArrowUpRight size={16} />
                    </BlobButton>
                    <Link
                      href={`/work?category=${encodeURIComponent(srv.relevantWorkFilter)}`}
                      className="service-sublink"
                    >
                      <span>Explore {srv.title} Projects ↗</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Strategic Workflow Integration */}
        <section className="container section services-process-section">
          <div className="section-head">
            <div>
              <div className="kicker">Seamless Collaboration</div>
              <h2>How Every Project Unfolds.</h2>
            </div>
            <div className="section-head-side">
              <p>
                Clear phases, transparent feedback loops, and scheduled milestone demos
                keep our work predictable and on-time.
              </p>
            </div>
          </div>

          <div className="process-flow-grid">
            {[
              {
                num: "01",
                title: "Discover",
                desc: "Understand business goals, target audience, competitive landscape, and core constraints.",
                tag: "Audit & Brief",
                icon: <Search size={18} />,
              },
              {
                num: "02",
                title: "Define",
                desc: "Map user journeys, sitemaps, information architecture, and functional scopes.",
                tag: "IA & User Flows",
                icon: <Target size={18} />,
              },
              {
                num: "03",
                title: "Design",
                desc: "Craft responsive wireframes, design systems, and interactive Figma prototypes.",
                tag: "Figma & Systems",
                icon: <Palette size={18} />,
              },
              {
                num: "04",
                title: "Build",
                desc: "Develop into clean, responsive Webflow or custom WordPress architectures.",
                tag: "Production Code",
                icon: <Code2 size={18} />,
              },
              {
                num: "05",
                title: "Refine",
                desc: "Conduct thorough QA testing, accessibility audit, performance optimization, and launch.",
                tag: "Launch & Polish",
                icon: <CheckCircle2 size={18} />,
              },
            ].map((step) => (
              <div className="process-card collaboration-card" key={step.num}>
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

        {/* Global Conversion CTA */}
        <section className="container section services-bottom-cta">
          <div className="cta">
            <div className="kicker">Next Steps</div>
            <h2>Let’s discuss your project requirements.</h2>
            <p style={{ maxWidth: 620, margin: "16px auto 26px", color: "var(--muted)" }}>
              Share your timeline, product goals, or design challenges, and I’ll get back
              to you with a transparent scope outline and recommendations.
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
