import Link from "next/link";
import Nav from "@/components/Nav";
import LiveProjectGrid from "@/components/LiveProjectGrid";
import HomeFAQ from "@/components/HomeFAQ";
import Footer from "@/components/Footer";
import BlobButton from "@/components/ui/BlobButton";
import { sanitizeJsonLd } from "@/lib/security";
import {
  ArrowUpRight,
  Sparkles,
  Layers,
  Code2,
  Palette,
  Compass,
  CheckCircle2,
  Users,
  Target,
  Search,
  Cpu,
} from "lucide-react";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Muhammad Arslan",
    jobTitle: "UI/UX Designer, Webflow & WordPress Developer",
    url: "https://www.muhammadarslan.com",
    sameAs: [
      "https://www.linkedin.com/in/muhammad-arslan-pak786/",
      "https://www.behance.net/muhammadarslan294",
      "https://github.com/Muhammad-252",
      "https://www.instagram.com/muhammadarslan112/",
    ],
    knowsAbout: [
      "UI/UX Design",
      "Product Design",
      "Webflow Development",
      "WordPress Development",
      "Figma",
      "Design Systems",
      "User Research",
      "Prototyping",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: sanitizeJsonLd(jsonLd) }}
      />
      <Nav />
      <main id="main-content">
        {/* Luxury Studio Hero Section */}
        <section className="container hero-v3-section" aria-label="Introduction hero">
          <div className="hero-v3-grid">
            <div className="hero-v3-content">
              <div className="hero-status-pill">
                <span className="live-pulse-dot" />
                <span className="pill-status-text">Available for Q2 Projects</span>
                <span className="pill-sep">/</span>
                <span className="pill-role-text">UI/UX · Webflow · WordPress</span>
              </div>

              <h1 className="hero-h1-v3">
                Designing High-Impact Products &amp;{" "}
                <span className="hero-highlight-gradient">Websites That Convert.</span>
              </h1>

              <p className="hero-desc-v3">
                Senior UI/UX Designer and Webflow &amp; WordPress Developer. I specialize in designing high-impact digital products and intuitive websites that convert visitors into customers, partnering with founders, product teams, and ambitious brands to drive real business growth.
              </p>

              <div className="hero-cta-group">
                <BlobButton variant="primary" size="lg" href="#work" aria-label="Explore selected portfolio work">
                  <span>Explore Selected Work</span>
                  <ArrowUpRight size={17} />
                </BlobButton>
                <BlobButton variant="secondary" size="lg" href="/contact" aria-label="Start a project consultation">
                  <span>Start a Project</span>
                  <ArrowUpRight size={17} />
                </BlobButton>
              </div>

              <div className="hero-trust-bar">
                <div className="trust-stat">
                  <span className="stat-num">3+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="trust-sep" />
                <div className="trust-stat">
                  <span className="stat-num">20+</span>
                  <span className="stat-label">Products Launched</span>
                </div>
                <div className="trust-sep" />
                <div className="trust-stat">
                  <span className="stat-num">100%</span>
                  <span className="stat-label">On-Time Handoff</span>
                </div>
              </div>
            </div>

            {/* Studio Showcase Bento Card */}
            <div className="hero-studio-card" aria-label="Muhammad Arslan Designer Showcase">
              <div className="hero-studio-header">
                <div className="studio-designer-profile">
                  <div className="studio-avatar-wrap">
                    <img
                      className="studio-avatar-img"
                      src="/images/hero-portrait-v3.png"
                      alt="Muhammad Arslan"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="studio-designer-info">
                    <div className="studio-designer-name">Muhammad Arslan</div>
                    <span>UI/UX &amp; Webflow Specialist</span>
                  </div>
                </div>
                <div className="studio-live-pill">
                  <span className="live-pulse-dot" />
                  <span>Available</span>
                </div>
              </div>

              {/* Interactive Showcase Preview Canvas */}
              <div className="studio-canvas-preview">
                <div className="canvas-topbar">
                  <div className="canvas-dots">
                    <span className="canvas-dot" />
                    <span className="canvas-dot" />
                    <span className="canvas-dot" />
                  </div>
                  <span className="canvas-pill-active">SaaS &amp; Web Design System</span>
                </div>

                <div className="canvas-body">
                  <div className="canvas-mockup-row">
                    <div className="canvas-card-mock">
                      <div className="canvas-card-title">Average Conversion</div>
                      <div className="canvas-card-metric">+42.8%</div>
                      <div className="canvas-card-bar">
                        <div className="canvas-card-bar-fill" />
                      </div>
                    </div>
                    <div className="canvas-card-mock">
                      <div className="canvas-card-title">Lighthouse Speed</div>
                      <div className="canvas-card-metric">99 / 100</div>
                      <div className="canvas-card-bar">
                        <div className="canvas-card-bar-fill" style={{ width: "95%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="studio-craft-chips">
                  <span className="craft-chip">⚡ Figma to Webflow</span>
                  <span className="craft-chip">✦ Design Systems</span>
                  <span className="craft-chip">🚀 WordPress CMS</span>
                </div>
              </div>

              <div className="studio-card-footer">
                <span>📍 Based in Sialkot, PK</span>
                <span>🌍 Working Worldwide (US, UK, EU)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Selected Work Section */}
        <section className="container section" id="work" aria-label="Selected projects">
          <div className="section-head">
            <div>
              <div className="kicker">Portfolio</div>
              <h2>Selected Work</h2>
            </div>
            <div className="section-head-side">
              <p>
                A selection of digital products, websites, and experiences
                I&apos;ve designed and built for different industries and
                business goals.
              </p>
              <BlobButton variant="secondary" size="md" href="/work" aria-label="Browse complete showcase of projects">
                <span>View all work</span>
                <ArrowUpRight size={16} />
              </BlobButton>
            </div>
          </div>
          <LiveProjectGrid limit={3} />
        </section>

        {/* About Section */}
        <section className="container section" id="about" aria-label="About Muhammad Arslan">
          <div className="split">
            <div>
              <div className="kicker">About Me</div>
              <h2>
                Designing With Purpose.
                <br />
                Building With Precision.
              </h2>
            </div>
            <div className="about-copy">
              <p>
                I’m a UI/UX designer and no-code developer with 3+ years of
                experience turning ideas into intuitive, engaging digital
                products. My background in software engineering enables me to
                design interfaces that are not only visually compelling but
                technically feasible, scalable, and built for conversion.
              </p>
              <p style={{ marginTop: 14 }}>
                I partner with founders, growing startups, and design teams to
                bring clarity to complex user flows and build memorable online
                experiences.
              </p>
              <div style={{ marginTop: 28 }}>
                <BlobButton variant="secondary" size="md" href="/about">
                  <span>More About Me &amp; Philosophy</span>
                  <ArrowUpRight size={16} />
                </BlobButton>
              </div>
            </div>
          </div>

          <div className="facts" style={{ marginTop: 60 }}>
            <div className="fact">
              <b>3+</b>
              <span>Years of design &amp; development experience</span>
            </div>
            <div className="fact">
              <b>25+</b>
              <span>Projects designed &amp; delivered</span>
            </div>
            <div className="fact">
              <b>13+</b>
              <span>Industries explored</span>
            </div>
            <div className="fact">
              <b>100%</b>
              <span>Direct designer collaboration</span>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="container section" id="services" aria-label="Services offered">
          <div className="section-head">
            <div>
              <div className="kicker">Capabilities</div>
              <h2>How I Can Help</h2>
            </div>
            <div className="section-head-side">
              <p>
                Comprehensive design and development capabilities designed to take
                your product from initial ambiguity to production-ready launch.
              </p>
              <BlobButton variant="secondary" size="md" href="/services">
                <span>Explore Services</span>
                <ArrowUpRight size={16} />
              </BlobButton>
            </div>
          </div>

          <div className="service-grid capabilities-grid">
            <div className="service capability-card">
              <div className="capability-card-top">
                <div className="capability-icon-orb">
                  <Palette size={20} />
                </div>
                <span className="capability-num">01</span>
              </div>
              <h3>UI/UX Design</h3>
              <p>
                Research, wireframing, design systems, and high-fidelity prototypes crafted for clarity, brand identity, and effortless usability.
              </p>
              <div className="capability-tags">
                <span>UX Strategy</span>
                <span>Design Systems</span>
                <span>Figma Prototypes</span>
              </div>
            </div>

            <div className="service capability-card">
              <div className="capability-card-top">
                <div className="capability-icon-orb">
                  <Code2 size={20} />
                </div>
                <span className="capability-num">02</span>
              </div>
              <h3>Webflow Development</h3>
              <p>
                Responsive, CMS-driven websites built with Client-First standards, fluid micro-interactions, responsive testing, and fast load speeds.
              </p>
              <div className="capability-tags">
                <span>Client-First</span>
                <span>Motion &amp; Interactions</span>
                <span>CMS Architecture</span>
              </div>
            </div>

            <div className="service capability-card">
              <div className="capability-card-top">
                <div className="capability-icon-orb">
                  <Cpu size={20} />
                </div>
                <span className="capability-num">03</span>
              </div>
              <h3>WordPress Development</h3>
              <p>
                Custom block architectures, WooCommerce setups, and performant WordPress solutions built for ease of client editing and speed.
              </p>
              <div className="capability-tags">
                <span>Custom Blocks</span>
                <span>WooCommerce</span>
                <span>Core Web Vitals</span>
              </div>
            </div>

            <div className="service capability-card">
              <div className="capability-card-top">
                <div className="capability-icon-orb">
                  <Layers size={20} />
                </div>
                <span className="capability-num">04</span>
              </div>
              <h3>Product Design</h3>
              <p>
                End-to-end design for SaaS platforms, dashboards, and mobile apps crafted to simplify complex data and elevate user retention.
              </p>
              <div className="capability-tags">
                <span>SaaS Dashboards</span>
                <span>Mobile iOS &amp; Android</span>
                <span>Retention UX</span>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="container section" aria-label="Design and development process">
          <div className="section-head">
            <div>
              <div className="kicker">Workflow</div>
              <h2>From Idea to Launch</h2>
            </div>
            <div className="section-head-side">
              <p>
                A battle-tested 5-step methodology that keeps stakeholders
                aligned, eliminates scope creep, and ensures on-time delivery.
              </p>
            </div>
          </div>

          <div className="process-flow-grid">
            {[
              {
                num: "01",
                title: "Discover",
                desc: "Understand the business, users, goals, requirements, and constraints.",
                icon: <Search size={18} />,
              },
              {
                num: "02",
                title: "Define",
                desc: "Map user journeys, information architecture, and product requirements.",
                icon: <Target size={18} />,
              },
              {
                num: "03",
                title: "Design",
                desc: "Create wireframes, interfaces, design systems, and interactive prototypes.",
                icon: <Palette size={18} />,
              },
              {
                num: "04",
                title: "Build",
                desc: "Turn approved designs into responsive Webflow or WordPress experiences.",
                icon: <Code2 size={18} />,
              },
              {
                num: "05",
                title: "Refine",
                desc: "Test, iterate, optimize, and prepare the product for launch.",
                icon: <CheckCircle2 size={18} />,
              },
            ].map((step) => (
              <div className="process-card" key={step.num}>
                <div className="process-top-row">
                  <span className="process-number">{step.num}</span>
                  <div className="process-icon-wrap">{step.icon}</div>
                </div>
                <div className="process-card-title">{step.title}</div>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Work With Me Section */}
        <section className="container section" aria-label="Value proposition">
          <div className="section-head">
            <div>
              <div className="kicker">Why Work With Me</div>
              <h2>More Than Just Beautiful Interfaces.</h2>
            </div>
            <div className="section-head-side">
              <p>
                Good design isn&apos;t only about making something look good.
                It&apos;s about understanding the problem, simplifying
                complexity, and creating an experience that works for both users
                and the business.
              </p>
            </div>
          </div>

          <div className="value-pillars-grid">
            <div className="value-pillar-card">
              <div className="pillar-icon-box">
                <Users size={20} />
              </div>
              <div className="value-pillar-title">User-Focused</div>
              <p>
                Every screen is grounded in user intent and cognitive psychology.
                I minimize cognitive load to create websites that convert and retain users intuitively.
              </p>
            </div>

            <div className="value-pillar-card">
              <div className="pillar-icon-box">
                <Code2 size={20} />
              </div>
              <div className="value-pillar-title">Design + Development</div>
              <p>
                With software engineering foundations, I bridge Figma and production
                code seamlessly to deliver high-impact digital products without broken handoffs.
              </p>
            </div>

            <div className="value-pillar-card">
              <div className="pillar-icon-box">
                <Compass size={20} />
              </div>
              <div className="value-pillar-title">Detail-Oriented</div>
              <p>
                Meticulous attention to typographic scale, micro-interactions,
                accessible contrast ratios, and flawless responsiveness across
                all screen sizes.
              </p>
            </div>

            <div className="value-pillar-card">
              <div className="pillar-icon-box">
                <Target size={20} />
              </div>
              <div className="value-pillar-title">Business-Minded</div>
              <p>
                Designing high-impact products to move commercial metrics—increasing
                sign-ups, reducing churn, driving qualified leads, and
                differentiating your brand.
              </p>
            </div>
          </div>
        </section>

        {/* Toolbox Section */}
        <section className="container section" aria-label="Software tools and technologies">
          <div className="section-head">
            <div>
              <div className="kicker">Toolbox</div>
              <h2>Built with the right tools.</h2>
            </div>
            <div className="section-head-side">
              <p>
                A battle-tested stack of modern design systems, no-code platforms, and web engineering tools utilized to craft fast, scalable, and conversion-focused digital experiences.
              </p>
            </div>
          </div>
          <div className="tools">
            {[
              "Figma",
              "Webflow",
              "WordPress",
              "Framer",
              "Shopify",
              "CSS3 / Flexbox / Grid",
              "Design Systems",
              "Prototyping",
              "HTML5 & Semantic SEO",
              "JavaScript",
              "User Research",
              "Git",
            ].map((x) => (
              <span className="tool" key={x}>
                {x}
              </span>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <HomeFAQ />

        {/* Bottom CTA Section */}
        <section className="container section" id="contact" aria-label="Start a project consultation">
          <div className="cta">
            <div className="kicker">Ready to Collaborate?</div>
            <h2>Let’s build a digital experience that converts.</h2>
            <p style={{ maxWidth: 620, margin: "16px auto 28px", color: "var(--muted)", fontSize: "1.05rem" }}>
              Whether you need an end-to-end product design, a high-converting Webflow build, or a custom WordPress platform, let&apos;s discuss your roadmap.
            </p>
            <div className="actions" style={{ justifyContent: "center" }}>
              <BlobButton variant="primary" size="lg" href="/contact" aria-label="Start your digital project inquiry">
                <span>Start Your Project</span>
                <ArrowUpRight size={17} />
              </BlobButton>
              <BlobButton variant="secondary" size="lg" href="/work" aria-label="Browse all portfolio case studies">
                <span>Browse All Work</span>
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
