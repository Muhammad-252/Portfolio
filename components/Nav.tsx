"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowUpRight,
  Sparkles,
  MessageCircle,
  Linkedin,
  Github,
} from "lucide-react";
import BlobButton from "@/components/ui/BlobButton";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll and handle Escape key when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const navLinks = [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="container nav">
        <Link href="/" className="logo" aria-label="Muhammad Arslan Portfolio">
          ARSLAN<i>.</i>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navlinks" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA & Mobile Toggle Cluster */}
        <div className="nav-actions-cluster">
          <BlobButton variant="primary" size="sm" href="/contact" className="nav-desktop-cta">
            Let&apos;s talk ↗
          </BlobButton>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className={`mobile-menu-toggle ${isOpen ? "active" : ""}`}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Luxury Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-nav-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="mobile-nav-drawer"
              initial={{ y: -20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Status Header */}
              <div className="mobile-drawer-header">
                <div className="mobile-status-badge">
                  <span className="mobile-pulse-dot" />
                  <span>Available for new projects</span>
                </div>
                <button
                  type="button"
                  className="mobile-drawer-close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close navigation"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mobile-nav-list" aria-label="Mobile Navigation">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.05 + idx * 0.04,
                      duration: 0.25,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      className="mobile-nav-item"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="mobile-nav-label">{link.label}</span>
                      <ArrowUpRight size={17} className="mobile-nav-arrow" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Quick Action Buttons */}
              <div className="mobile-nav-footer">
                <BlobButton
                  href="/contact"
                  variant="primary"
                  size="md"
                  className="mobile-full-cta"
                  onClick={() => setIsOpen(false)}
                >
                  <Sparkles size={15} />
                  <span>Start a Project</span>
                  <ArrowUpRight size={16} />
                </BlobButton>

                <BlobButton
                  href="https://wa.me/923015517804"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="md"
                  className="mobile-whatsapp-cta"
                >
                  <MessageCircle size={15} />
                  <span>Chat on WhatsApp</span>
                </BlobButton>

                {/* Social Quick Links */}
                <div className="mobile-social-row">
                  <a
                    href="https://www.linkedin.com/in/muhammad-arslan-b684b321a"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={16} />
                  </a>
                  <a
                    href="https://github.com/Muhammad-252"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <Github size={16} />
                  </a>
                  <a
                    href="https://www.behance.net/muhammadarslan252"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Behance"
                  >
                    <span style={{ fontSize: 13, fontWeight: 700 }}>Bē</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
