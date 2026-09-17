import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, Database, Globe, Mail, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Muhammad Arslan",
  description:
    "Privacy policy and data transparency statement for Muhammad Arslan's UI/UX design and development studio portfolio.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Nav />
      <main className="container" style={{ padding: "80px 0 120px 0", maxWidth: "860px" }}>
        {/* Header */}
        <section style={{ marginBottom: "48px" }}>
          <div className="contact-eyebrow-pill" style={{ marginBottom: "16px" }}>
            <Shield size={14} />
            <span>Transparency &amp; Data Protection · Last Updated: 2026</span>
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "20px" }}>
            Privacy Policy &amp; <span className="hero-highlight-gradient">Security Practices</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "1.1rem", lineHeight: 1.7 }}>
            This Privacy Policy outlines how your personal information is gathered, utilized, and protected when you interact with the digital portfolio and consulting services of Muhammad Arslan.
          </p>
        </section>

        {/* Content Blocks */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {/* Section 1 */}
          <div className="card" style={{ padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ color: "#d7ff3f" }}><Lock size={20} /></div>
              <h2 style={{ fontSize: "1.25rem", margin: 0 }}>1. Direct Inquiries &amp; Information Collection</h2>
            </div>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "16px" }}>
              We collect information that you voluntarily submit when initiating project inquiries or communications:
            </p>
            <ul style={{ color: "var(--muted)", lineHeight: 1.8, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Contact Identifiers:</strong> Name, work email address, and company/organization name.</li>
              <li><strong>Project Briefs:</strong> Desired services (UI/UX design, Webflow development, WordPress development), budget estimates, and project scope details.</li>
              <li><strong>Direct Channels:</strong> Messages transmitted via direct email or encrypted messaging (WhatsApp).</li>
            </ul>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginTop: "16px" }}>
              We never sell, rent, or distribute your inquiry data to data brokers, third-party advertisers, or marketing networks.
            </p>
          </div>

          {/* Section 2 */}
          <div className="card" style={{ padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ color: "#00f0ff" }}><Eye size={20} /></div>
              <h2 style={{ fontSize: "1.25rem", margin: 0 }}>2. Browser Storage &amp; Cookies</h2>
            </div>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "16px" }}>
              This website is engineered with a privacy-first, minimal-footprint philosophy:
            </p>
            <ul style={{ color: "var(--muted)", lineHeight: 1.8, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Essential LocalStorage:</strong> We use browser LocalStorage strictly for functional purposes: caching portfolio taxonomies, retaining reading progress, and preventing automated form spam.</li>
              <li><strong>Zero Invasive Tracking Cookies:</strong> We do not deploy third-party advertising pixels, behavioral marketing tracking, or persistent cross-site tracking cookies.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="card" style={{ padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ color: "#d7ff3f" }}><Database size={20} /></div>
              <h2 style={{ fontSize: "1.25rem", margin: 0 }}>3. Infrastructure &amp; Technical Subprocessors</h2>
            </div>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "16px" }}>
              To deliver high performance and reliable uptime, this website utilizes modern, reputable infrastructure providers:
            </p>
            <ul style={{ color: "var(--muted)", lineHeight: 1.8, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Hosting &amp; CDN:</strong> Vercel Global Edge Network for static site compilation and content delivery under strict Transport Layer Security (TLS 1.3 / HTTPS).</li>
              <li><strong>Cloud Database &amp; Storage:</strong> Supabase (PostgreSQL) for authorized content administration, protected by strict server-side Row-Level Security (RLS) policies.</li>
              <li><strong>Media Hosting:</strong> Unsplash for high-resolution project reference photography.</li>
              <li><strong>Website Analytics:</strong> Google Analytics (GA4) via Google Tag Manager for aggregated, privacy-preserving visitor and page engagement metrics.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="card" style={{ padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ color: "#00f0ff" }}><Globe size={20} /></div>
              <h2 style={{ fontSize: "1.25rem", margin: 0 }}>4. Security Hardening &amp; Defense-in-Depth</h2>
            </div>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "16px" }}>
              We enforce industry-standard defensive controls across our codebase:
            </p>
            <ul style={{ color: "var(--muted)", lineHeight: 1.8, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Strict Content-Security-Policy (CSP):</strong> Defends against Cross-Site Scripting (XSS) by restricting executable script, style, and frame sources.</li>
              <li><strong>Anti-Clickjacking Headers:</strong> Enforces <code>X-Frame-Options: DENY</code> and CSP <code>frame-ancestors: none</code>.</li>
              <li><strong>MIME Protection:</strong> Enforces <code>X-Content-Type-Options: nosniff</code>.</li>
              <li><strong>Bot Protection &amp; Throttling:</strong> Incorporates automated honeypot spam detection and client submission rate limiting.</li>
              <li><strong>Strict Non-Disclosure (NDA):</strong> All proprietary project briefs and confidential client designs shared during discovery are treated as strictly confidential.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="card" style={{ padding: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ color: "#d7ff3f" }}><Mail size={20} /></div>
              <h2 style={{ fontSize: "1.25rem", margin: 0 }}>5. Your Rights &amp; Contact Information</h2>
            </div>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "16px" }}>
              You retain full rights to request access to, updates for, or permanent deletion of any personal communications or briefs you have submitted.
            </p>
            <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
              For inquiries regarding this privacy statement or to request deletion of your information, please contact:
            </p>
            <div style={{ marginTop: "16px", padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p style={{ margin: "0 0 6px 0", fontWeight: 600 }}>Muhammad Arslan</p>
              <p style={{ margin: "0 0 6px 0", color: "var(--muted)", fontSize: "14px" }}>Lead UI/UX Designer &amp; Webflow Developer</p>
              <a href="mailto:marslanprofessional@gmail.com" style={{ color: "#d7ff3f", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>
                marslanprofessional@gmail.com ↗
              </a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "48px", textAlign: "center" }}>
          <Link href="/" className="pill">
            ← Return to Portfolio Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
