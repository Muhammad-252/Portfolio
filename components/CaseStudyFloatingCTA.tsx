"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles, X, MessageSquare } from "lucide-react";
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
        <motion.div
          className="case-floating-cta-root"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {minimized ? (
            /* Minimized Pill Trigger */
            <button
              type="button"
              className="case-floating-cta-minimized"
              onClick={() => setMinimized(false)}
              aria-label="Expand project inquiry card"
              title="Expand project inquiry"
            >
              <span className="minimized-pulse-dot" />
              <Sparkles size={14} className="minimized-sparkle-icon" />
              <span className="minimized-text">Start a Project</span>
              <ArrowUpRight size={14} />
            </button>
          ) : (
            /* Full Floating Glassmorphism Card */
            <div className="case-floating-cta-card">
              {/* Subtle ambient rotating glow element */}
              <div className="card-ambient-orbit" aria-hidden="true" />

              {/* Card Header Bar */}
              <div className="card-header-row">
                <div className="availability-pill">
                  <span className="availability-pulse-dot" />
                  <span>Open for Projects</span>
                </div>
                <button
                  type="button"
                  className="card-minimize-btn"
                  onClick={() => setMinimized(true)}
                  aria-label="Minimize floating card"
                  title="Minimize"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Card Body */}
              <div className="card-content-body">
                <h4 className="card-inquiry-title">Have a similar project in mind?</h4>
                <p className="card-inquiry-desc">
                  {projectTitle ? (
                    <>Let&apos;s talk about building a tailored experience like <em>{projectTitle}</em> for your business.</>
                  ) : (
                    <>Let&apos;s talk about how I can help bring your digital product to life.</>
                  )}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="card-actions-row">
                <Link href="/contact" className="pill primary card-cta-btn">
                  <span>Start a Project</span>
                  <ArrowUpRight size={14} />
                </Link>
                <Link href="/#about" className="card-secondary-link" title="Learn more about my process">
                  <MessageSquare size={13} />
                  <span>Process</span>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
