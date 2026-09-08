"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Minus, HelpCircle, MessageCircle, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BlobButton from "@/components/ui/BlobButton";
import { useFaqs } from "@/lib/useFaqs";
import { FAQ_CATEGORIES } from "@/lib/faqTypes";

export default function HomeFAQ() {
  const { faqs } = useFaqs();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openId, setOpenId] = useState<string | null>("faq-process-1"); // Open the first item by default

  const publishedFaqs = useMemo(() => {
    return faqs.filter((f) => f.published);
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    if (selectedCategory === "All") return publishedFaqs;
    return publishedFaqs.filter((f) => f.category === selectedCategory);
  }, [publishedFaqs, selectedCategory]);

  function toggleItem(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <section className="container section faq-section-root" id="faq">
      {/* Section Header */}
      <div className="section-head faq-section-head">
        <div>
          <div className="curated-badge" style={{ marginBottom: 12 }}>
            <HelpCircle size={12} />
            <span>Clarity &amp; Process</span>
          </div>
          <h2 className="faq-heading-title">Frequently Asked Questions<i>.</i></h2>
        </div>
        <div className="section-head-side">
          <p>
            Everything you need to know about working together, timelines, deliverables,
            and translating requirements into award-winning interfaces.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="faq-category-nav">
        {FAQ_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          const count =
            cat === "All"
              ? publishedFaqs.length
              : publishedFaqs.filter((f) => f.category === cat).length;

          if (count === 0 && cat !== "All") return null;

          return (
            <button
              key={cat}
              type="button"
              className={`faq-cat-pill ${isActive ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFaqCategoryHighlight"
                  className="faq-active-pill-bg"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="pill-text">{cat}</span>
              <span className="pill-bubble">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Accordion List */}
      <div className="faq-accordion-list">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openId === faq.id;
          const num = String(index + 1).padStart(2, "0");

          return (
            <div
              key={faq.id}
              className={`faq-accordion-item ${isOpen ? "is-open" : ""}`}
            >
              <button
                type="button"
                className="faq-accordion-trigger"
                onClick={() => toggleItem(faq.id)}
                aria-expanded={isOpen}
              >
                <div className="faq-trigger-left">
                  <span className="faq-item-number">{num}</span>
                  <span className="faq-question-text">{faq.question}</span>
                </div>

                <div className="faq-trigger-right">
                  <span className="faq-category-mini-badge">{faq.category}</span>
                  <div className={`faq-icon-orb ${isOpen ? "active" : ""}`}>
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="faq-accordion-collapse"
                  >
                    <div className="faq-accordion-body">
                      <p>{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Bottom Direct Inquiry Box */}
      <div className="faq-bottom-box">
        <div className="faq-bottom-left">
          <div className="faq-bottom-icon-wrap">
            <MessageCircle size={18} />
          </div>
          <div>
            <h4>Have a specific question not answered here?</h4>
            <p>I’m always happy to discuss technical constraints, timeline milestones, or budget fit.</p>
          </div>
        </div>
        <BlobButton href="/contact" variant="primary" size="md" className="faq-bottom-btn">
          <span>Let&apos;s Have a Chat</span>
          <ArrowUpRight size={14} />
        </BlobButton>
      </div>
    </section>
  );
}
