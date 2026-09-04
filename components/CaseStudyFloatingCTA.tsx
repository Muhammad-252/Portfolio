"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CaseStudyFloatingCTAProps {
  projectTitle?: string;
}

export default function CaseStudyFloatingCTA({ projectTitle }: CaseStudyFloatingCTAProps) {
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Show when scrolled past 280px (past hero area)
      if (window.scrollY > 280) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          className="case-floating-cta-root"
          initial={{ opacity: 0, y: 35, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 25, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Project collaboration quick inquiry"
        >
          {minimized ? (
            /* Minimized Trigger */
            <button
              type="button"
              className="case-floating-cta-minimized"
              onClick={() => setMinimized(false)}
              aria-label="Expand project inquiry card"
            >
              <span className="minimized-pulse-dot" />
              <Sparkles size={14} className="minimized-sparkle-icon" />
              <span className="minimized-text">Let&apos;s Work Together</span>
              <ArrowUpRight size={14} />
            </button>
          ) : (
            /* Full Floating Glassmorphic Card */
            <div className="case-floating-cta-card">
              <div className="card-ambient-orbit" aria-hidden="true" />

              <div className="card-header-row">
                <div className="availability-pill">
                  <span className="availability-pulse-dot" />
                  <span>Available for Projects</span>
                </div>
                <button
                  type="button"
                  className="card-minimize-btn"
                  onClick={() => setMinimized(true)}
                  aria-label="Dismiss floating prompt"
                  title="Minimize"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="card-content-body">
                <h4 className="card-inquiry-title">Need a similar solution?</h4>
                <p className="card-inquiry-desc">
                  Let’s create something that works for your business.
                </p>
              </div>

              <div className="card-actions-row">
                <Link
                  href={`/contact${projectTitle ? `?ref=${encodeURIComponent(projectTitle)}` : ""}`}
                  className="pill primary card-cta-btn"
                >
                  <span>Let’s Work Together</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
