import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";

export default function Footer() {
  return (
    <footer className="container site-footer" aria-label="Site footer">
      <div className="footer-top-grid">
        <div className="footer-brand-column">
          <Link href="/" className="logo" aria-label="Muhammad Arslan Portfolio">
            ARSLAN<i>.</i>
          </Link>
          <div className="footer-positioning-tag">
            UI/UX Designer · Webflow Developer · WordPress Developer
          </div>
          <p className="footer-bio-text">
            Muhammad Arslan is a UI/UX designer and Webflow &amp; WordPress developer specializing in digital product design, websites, web applications, and user-centered experiences for startups and businesses.
          </p>
          <div className="footer-location-tag">
            <span className="live-pulse-dot" />
            <span>Based in Sialkot, Pakistan · Available Worldwide</span>
          </div>
        </div>

        <div className="footer-links-column">
          <span className="footer-col-title">Navigation</span>
          <nav className="footer-nav-list" aria-label="Footer navigation">
            <Link href="/" aria-label="Return to Homepage">Home</Link>
            <Link href="/work" aria-label="Browse Portfolio Case Studies">Portfolio Work</Link>
            <Link href="/services" aria-label="Explore UI/UX and Development Services">Services &amp; Pricing</Link>
            <Link href="/about" aria-label="Learn more about Muhammad Arslan">About Experience</Link>
            <Link href="/blog" aria-label="Read Articles and Design Insights">Articles &amp; Blog</Link>
            <Link href="/contact" aria-label="Contact Muhammad Arslan directly">Get in Touch</Link>
          </nav>
        </div>

        <div className="footer-connect-column">
          <span className="footer-col-title">Connect &amp; Social</span>
          <p className="footer-connect-lead">
            Open for freelance UI/UX design, Webflow development, and full digital product contracts.
          </p>
          <SocialLinks variant="icons" />
          <div className="footer-direct-mail">
            <a href="mailto:marslanprofessional@gmail.com" className="footer-mail-link">
              marslanprofessional@gmail.com ↗
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <span>© {new Date().getFullYear()} Muhammad Arslan. All rights reserved.</span>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link
            href="/privacy"
            style={{
              color: "var(--muted)",
              textDecoration: "none",
              fontSize: "13px",
              padding: "10px 8px",
              display: "inline-flex",
              alignItems: "center",
              minHeight: "44px",
            }}
          >
            Privacy Policy
          </Link>
          <span>·</span>
          <span>Designed with purpose · Engineered with precision</span>
        </div>
      </div>
    </footer>
  );
}
