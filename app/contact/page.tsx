"use client";

import { FormEvent, useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  MessageCircle,
  Clock,
  Globe2,
  ShieldCheck,
  Send,
} from "lucide-react";
import Nav from "@/components/Nav";
import SocialLinks from "@/components/SocialLinks";
import Footer from "@/components/Footer";

const PROJECT_TYPES = [
  "UI/UX Design",
  "Webflow Development",
  "WordPress Development",
  "Product Design",
  "Website Redesign",
  "UX Audit",
  "Other",
];

const BUDGET_RANGES = [
  "$1,000 – $3,000",
  "$3,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
  "Not sure yet",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [projectType, setProjectType] = useState("UI/UX Design");
  const [budget, setBudget] = useState("$3,000 – $5,000");

  useEffect(() => {
    document.title = "Contact Muhammad Arslan | UI/UX Designer & Webflow Developer";
  }, []);

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name") || "";
    const email = form.get("email") || "";
    const company = form.get("company") || "Not specified";
    const message = form.get("message") || "";

    const subject = `Project Inquiry from ${name} (${projectType})`;
    const body = `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nProject Type: ${projectType}\nBudget Range: ${budget}\n\nProject Overview:\n${message}`;

    setSubmitted(true);

    // Open mail client
    window.location.href = `mailto:marslanprofessional@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <>
      <Nav />
      <main className="container contact-container-v3">
        {/* Atmospheric Header */}
        <section className="contact-header-v3">
          <div className="contact-eyebrow-pill">
            <span className="live-pulse-dot" />
            <span>Available for Q2 Projects · Direct Collaboration</span>
          </div>
          <h1 className="contact-title-v3">
            Let&apos;s Build Something <span className="hero-highlight-gradient">Extraordinary.</span>
          </h1>
          <p className="contact-lead-v3">
            Looking for a UI/UX designer or Webflow &amp; WordPress developer? Tell me about your
            project goals and I&apos;ll get back to you with a roadmap, timeline, and estimate within 24 hours.
          </p>
        </section>

        {/* Two-Column Luxury Studio Layout */}
        <section className="contact-grid-v3">
          {/* Left Column: Inquiry Console */}
          <div className="contact-form-column">
            {submitted ? (
              <div className="contact-success-card">
                <div className="success-glow-orb">
                  <CheckCircle2 size={38} className="success-icon" />
                </div>
                <h2>Thanks for reaching out!</h2>
                <p className="success-subtext">
                  Your project brief is prepared. Your default mail app was opened to send the details directly to my inbox.
                </p>
                <div className="success-action-cluster">
                  <a
                    href="mailto:marslanprofessional@gmail.com"
                    className="hero-cta-btn-primary"
                  >
                    <Mail size={16} />
                    <span>Open Email Client</span>
                  </a>
                  <a
                    href="https://wa.me/923015517804"
                    target="_blank"
                    rel="noreferrer"
                    className="hero-cta-btn-secondary"
                  >
                    <MessageCircle size={16} />
                    <span>Chat on WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    className="hero-cta-btn-secondary"
                    onClick={() => setSubmitted(false)}
                  >
                    Edit Message
                  </button>
                </div>
              </div>
            ) : (
              <form className="contact-card-v3" onSubmit={submitForm}>
                <div className="form-section-title">01 · Project Scope</div>
                <div className="pill-selector-row">
                  {PROJECT_TYPES.map((type) => (
                    <button
                      type="button"
                      key={type}
                      className={`select-pill ${projectType === type ? "active" : ""}`}
                      onClick={() => setProjectType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="form-section-title">02 · Approximate Investment</div>
                <div className="pill-selector-row">
                  {BUDGET_RANGES.map((b) => (
                    <button
                      type="button"
                      key={b}
                      className={`select-pill ${budget === b ? "active" : ""}`}
                      onClick={() => setBudget(b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>

                <div className="form-section-title">03 · Project &amp; Contact Details</div>
                <div className="inputs-2col">
                  <div className="input-field-group">
                    <label>Your Name *</label>
                    <input
                      className="modern-input"
                      name="name"
                      required
                      placeholder="e.g. Alex Morgan"
                    />
                  </div>
                  <div className="input-field-group">
                    <label>Work Email *</label>
                    <input
                      className="modern-input"
                      name="email"
                      required
                      type="email"
                      placeholder="alex@company.com"
                    />
                  </div>
                </div>

                <div className="input-field-group">
                  <label>Company / Organization or Existing Website</label>
                  <input
                    className="modern-input"
                    name="company"
                    placeholder="e.g. Acme Studio, early-stage startup, or your current URL"
                  />
                </div>

                <div className="input-field-group">
                  <label>Project Overview &amp; Goals *</label>
                  <textarea
                    className="modern-textarea"
                    name="message"
                    required
                    rows={4}
                    placeholder="Tell me about your product, what you want to achieve, timeline, or links to existing designs / references..."
                  />
                </div>

                <div className="form-action-row-v3">
                  <button className="submit-pill-btn" type="submit">
                    <span>Send Project Inquiry</span>
                    <Send size={16} />
                  </button>
                  <div className="direct-guarantee-note">
                    <ShieldCheck size={16} />
                    <span>Direct reply from Muhammad within 24h · Strict NDA</span>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Unified Studio Direct Hub */}
          <aside className="contact-hub-sidebar">
            <div className="hub-card">
              <div className="hub-designer-header">
                <div className="hub-designer-avatar">
                  <img
                    src="/images/hero-portrait-v3.png"
                    alt="Muhammad Arslan"
                    width={54}
                    height={54}
                  />
                </div>
                <div className="hub-designer-info">
                  <h3>Muhammad Arslan</h3>
                  <p>UI/UX Designer &amp; Webflow Developer</p>
                </div>
              </div>

              <p className="hub-bio-text">
                I partner directly with founders, product leads, and agencies to build high-converting
                digital products and Webflow / WordPress websites with zero intermediary friction.
              </p>

              <div className="hub-direct-channels">
                <a
                  href="mailto:marslanprofessional@gmail.com"
                  className="hub-channel-item"
                >
                  <div className="channel-icon-label">
                    <div className="channel-icon-circle">
                      <Mail size={16} />
                    </div>
                    <div className="channel-meta">
                      <span className="channel-meta-title">Direct Email</span>
                      <span className="channel-meta-val">marslanprofessional@gmail.com</span>
                    </div>
                  </div>
                  <ArrowUpRight size={16} style={{ color: "#777" }} />
                </a>

                <a
                  href="https://wa.me/923015517804"
                  target="_blank"
                  rel="noreferrer"
                  className="hub-channel-item"
                >
                  <div className="channel-icon-label">
                    <div className="channel-icon-circle">
                      <Phone size={16} />
                    </div>
                    <div className="channel-meta">
                      <span className="channel-meta-title">WhatsApp Instant</span>
                      <span className="channel-meta-val">+92 301 5517804</span>
                    </div>
                  </div>
                  <ArrowUpRight size={16} style={{ color: "#777" }} />
                </a>
              </div>

              <div className="hub-pledges-list">
                <div className="hub-pledge-item">
                  <Clock size={16} />
                  <span>&lt; 24-Hour turnaround on quotes and project briefs</span>
                </div>
                <div className="hub-pledge-item">
                  <Globe2 size={16} />
                  <span>Async-friendly across US, UK &amp; Global timezones</span>
                </div>
                <div className="hub-pledge-item">
                  <ShieldCheck size={16} />
                  <span>100% Direct collaboration &amp; full IP / code handoff</span>
                </div>
              </div>

              <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", marginBottom: 12 }}>
                  Connect Online
                </div>
                <SocialLinks variant="cards" />
              </div>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}
