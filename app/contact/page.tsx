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
  AlertCircle,
  Loader2,
} from "lucide-react";
import Nav from "@/components/Nav";
import SocialLinks from "@/components/SocialLinks";
import Footer from "@/components/Footer";
import Link from "next/link";
import BlobButton from "@/components/ui/BlobButton";
import { isValidEmail, rateLimitCheck } from "@/lib/security";

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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState<{
    delivered: boolean;
    method?: string;
  } | null>(null);

  useEffect(() => {
    document.title = "Contact Muhammad Arslan | UI/UX Designer & Webflow Developer";
  }, []);

  const handleInputChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (formError) setFormError("");
  };

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const form = new FormData(event.currentTarget);

    // 1. Honeypot check for automated bot scrapers
    const botcheck = form.get("botcheck")?.toString() || "";
    if (botcheck) {
      return; // Silently drop bot submission
    }

    // 2. Client-side field validations
    const errs: Record<string, string> = {};
    const name = formData.name.trim().slice(0, 100);
    const email = formData.email.trim().slice(0, 120);
    const company = formData.company.trim().slice(0, 120);
    const message = formData.message.trim().slice(0, 3000);

    if (!name) {
      errs.name = "Please enter your name.";
    } else if (name.length < 2) {
      errs.name = "Name must be at least 2 characters.";
    }

    if (!email) {
      errs.email = "Please enter your work email address.";
    } else if (!isValidEmail(email)) {
      errs.email = "Please enter a valid email address (e.g. name@company.com).";
    }

    if (!message) {
      errs.message = "Please describe your project goals and requirements.";
    } else if (message.length < 10) {
      errs.message = "Project overview must be at least 10 characters.";
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setFormError("Please correct the highlighted errors before submitting.");
      return;
    }

    // 3. Submission rate-limiting (10 second cooldown)
    const throttle = rateLimitCheck("contact_form", 10000);
    if (!throttle.allowed) {
      setFormError(`Please wait ${throttle.remainingSec}s before submitting again.`);
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company: company || "Not specified",
          projectType,
          budget,
          message,
          botcheck,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        if (result?.errors) {
          setFieldErrors(result.errors);
        }
        setFormError(
          result?.message ||
            "Unable to submit inquiry right now. Please try again or reach out on WhatsApp."
        );
        setIsSubmitting(false);
        return;
      }

      setDeliveryResult({
        delivered: Boolean(result.delivered),
        method: result.method,
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error("Submission fetch error:", err);
      setFormError(
        "Network connection error. Please verify your internet or contact directly via email/WhatsApp."
      );
    } finally {
      setIsSubmitting(false);
    }
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
                <h2>Inquiry Successfully Received!</h2>
                <p className="success-subtext">
                  {deliveryResult?.delivered
                    ? "Your project brief was delivered directly to Muhammad's inbox at marslanprofessional@gmail.com. You will receive a personal reply within 24 hours."
                    : deliveryResult?.method === "formsubmit-activation-needed"
                    ? "Form connected! FormSubmit sent a one-time 'Activate Form' confirmation email to marslanprofessional@gmail.com. Please click the activation link in your inbox to enable direct deliveries."
                    : "Your project brief has been recorded. You can also send a pre-filled copy directly from your email app or chat instantly on WhatsApp."}
                </p>
                <div className="success-action-cluster">
                  <a
                    href={`mailto:marslanprofessional@gmail.com?subject=${encodeURIComponent(
                      `Project Inquiry from ${formData.name} (${projectType})`
                    )}&body=${encodeURIComponent(
                      `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company || "Not specified"}\nProject Type: ${projectType}\nBudget Range: ${budget}\n\nProject Overview:\n${formData.message}`
                    )}`}
                    className="hero-cta-btn-primary"
                  >
                    <Mail size={16} />
                    <span>Open Email Client (Pre-filled)</span>
                  </a>
                  <a
                    href={`https://wa.me/923015517804?text=${encodeURIComponent(
                      `Hi Muhammad, I just submitted an inquiry on your portfolio for a ${projectType} project (${budget}). Name: ${formData.name}.`
                    )}`}
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
                    onClick={() => {
                      setSubmitted(false);
                      setDeliveryResult(null);
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form className="contact-card-v3" onSubmit={submitForm} noValidate>
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

                {/* Anti-bot Honeypot field (hidden from legitimate users) */}
                <input
                  type="text"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ display: "none", position: "absolute", left: "-9999px" }}
                  aria-hidden="true"
                />

                <div className="form-section-title">03 · Project &amp; Contact Details</div>
                <div className="inputs-2col">
                  <div className="input-field-group">
                    <label htmlFor="name-input">Your Name *</label>
                    <input
                      id="name-input"
                      className={`modern-input ${fieldErrors.name ? "input-error" : ""}`}
                      name="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      maxLength={100}
                      placeholder="e.g. Alex Morgan"
                      autoComplete="name"
                      aria-invalid={Boolean(fieldErrors.name)}
                    />
                    {fieldErrors.name && (
                      <span className="field-error-text">
                        <AlertCircle size={13} /> {fieldErrors.name}
                      </span>
                    )}
                  </div>
                  <div className="input-field-group">
                    <label htmlFor="email-input">Work Email *</label>
                    <input
                      id="email-input"
                      className={`modern-input ${fieldErrors.email ? "input-error" : ""}`}
                      name="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      maxLength={120}
                      type="email"
                      placeholder="alex@company.com"
                      autoComplete="email"
                      aria-invalid={Boolean(fieldErrors.email)}
                    />
                    {fieldErrors.email && (
                      <span className="field-error-text">
                        <AlertCircle size={13} /> {fieldErrors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="input-field-group">
                  <label htmlFor="company-input">Company / Organization or Existing Website</label>
                  <input
                    id="company-input"
                    className="modern-input"
                    name="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    maxLength={120}
                    placeholder="e.g. Acme Studio, early-stage startup, or your current URL"
                    autoComplete="organization"
                  />
                </div>

                <div className="input-field-group">
                  <label htmlFor="message-input">Project Overview &amp; Goals *</label>
                  <textarea
                    id="message-input"
                    className={`modern-textarea ${fieldErrors.message ? "input-error" : ""}`}
                    name="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    maxLength={3000}
                    rows={4}
                    placeholder="Tell me about your product, what you want to achieve, timeline, or links to existing designs / references..."
                    aria-invalid={Boolean(fieldErrors.message)}
                  />
                  {fieldErrors.message && (
                    <span className="field-error-text">
                      <AlertCircle size={13} /> {fieldErrors.message}
                    </span>
                  )}
                </div>

                {formError && (
                  <div
                    className="notice"
                    style={{
                      color: "#ff6b6b",
                      borderColor: "rgba(255,107,107,0.3)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 16,
                    }}
                  >
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="form-action-row-v3">
                  <BlobButton
                    variant="primary"
                    size="md"
                    type="submit"
                    disabled={isSubmitting}
                    className="submit-pill-btn"
                    style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Sending Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Project Inquiry</span>
                        <Send size={16} />
                      </>
                    )}
                  </BlobButton>
                  <div className="direct-guarantee-note">
                    <ShieldCheck size={16} />
                    <span>Direct reply from Muhammad within 24h · Strict NDA</span>
                  </div>
                </div>

                <p style={{ marginTop: 14, fontSize: 12, color: "#777", lineHeight: 1.5 }}>
                  Your brief is handled with strict confidentiality. For details on data handling, see our{" "}
                  <Link href="/privacy" style={{ color: "#aaa", textDecoration: "underline" }}>
                    Privacy Policy
                  </Link>.
                </p>
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
