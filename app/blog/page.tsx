"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  X,
  Sparkles,
  BookOpen,
  Clock,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/Nav";
import SocialLinks from "@/components/SocialLinks";
import { useBlogPosts } from "@/lib/useBlogPosts";
import { BLOG_CATEGORIES } from "@/lib/blogTypes";

export default function BlogListingPage() {
  const { posts } = useBlogPosts();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const publishedPosts = useMemo(() => {
    return posts.filter((p) => p.published);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return publishedPosts.filter((post) => {
      const matchCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase().trim()));
      return matchCategory && matchSearch;
    });
  }, [publishedPosts, selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return publishedPosts.find((p) => p.featured) || publishedPosts[0];
  }, [publishedPosts]);

  // Exclude featured post from the grid if we are on "All" without search, for editorial variety
  const gridPosts = useMemo(() => {
    if (selectedCategory === "All" && !searchQuery.trim() && featuredPost) {
      return filteredPosts.filter((p) => p.slug !== featuredPost.slug);
    }
    return filteredPosts;
  }, [filteredPosts, selectedCategory, searchQuery, featuredPost]);

  return (
    <>
      <Nav />

      <main className="blog-page-root">
        {/* Header Hero */}
        <section className="container blog-hero">
          <div className="blog-hero-top">
            <div className="curated-badge">
              <BookOpen size={12} />
              <span>Perspectives &amp; Craft</span>
            </div>
            <h1 className="blog-title">
              Thoughts on design, systems &amp; products<i>.</i>
            </h1>
            <p className="blog-subtitle">
              Deep dives on design token architectures, UX psychology, interaction design,
              and bridging the gap between Figma files and production code.
            </p>
          </div>

          {/* Filter & Search Bar */}
          <div className="blog-controls-suite">
            {/* Category Pills Track */}
            <div className="blog-category-track">
              {BLOG_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                const count =
                  cat === "All"
                    ? publishedPosts.length
                    : publishedPosts.filter((p) => p.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    className={`blog-category-pill ${isActive ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeBlogCategoryIndicator"
                        className="blog-active-pill-highlight"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="pill-label">{cat}</span>
                    <span className="pill-count-bubble">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="blog-search-wrap">
              <Search size={14} className="blog-search-icon" />
              <input
                type="text"
                className="blog-search-input"
                placeholder="Search articles, topics, tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="blog-search-clear"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search query"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Featured Editorial Article (Shown when no search query and category is All) */}
        {selectedCategory === "All" && !searchQuery.trim() && featuredPost && (
          <section className="container blog-featured-section">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="featured-editorial-card"
            >
              <div className="featured-cover-box">
                <img
                  src={featuredPost.cover}
                  alt={featuredPost.title}
                  className="featured-cover-img"
                />
                <div className="featured-spotlight-tag">
                  <Sparkles size={11} />
                  <span>Featured Editorial</span>
                </div>
              </div>

              <div className="featured-content-box">
                <div className="featured-meta-row">
                  <span className="badge badge-category">{featuredPost.category}</span>
                  <span className="meta-split-dot">•</span>
                  <span className="reading-time-indicator">
                    <Clock size={12} /> {featuredPost.readingTime}
                  </span>
                  <span className="meta-split-dot">•</span>
                  <span className="publish-date-indicator">
                    <Calendar size={12} /> {featuredPost.date}
                  </span>
                </div>

                <h2 className="featured-card-title">{featuredPost.title}</h2>
                <p className="featured-card-excerpt">{featuredPost.excerpt}</p>

                <div className="featured-author-footer">
                  <div className="featured-author-cell">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="author-avatar-img"
                    />
                    <div>
                      <strong className="author-name-text">
                        {featuredPost.author.name}
                      </strong>
                      <span className="author-role-text">
                        {featuredPost.author.role}
                      </span>
                    </div>
                  </div>

                  <span className="read-article-action">
                    Read Article <ArrowRight size={15} />
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="container blog-grid-section">
          {gridPosts.length > 0 ? (
            <div className="blog-posts-grid">
              <AnimatePresence mode="popLayout">
                {gridPosts.map((post) => (
                  <motion.article
                    key={post.id || post.slug}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                    className="blog-card"
                  >
                    <Link href={`/blog/${post.slug}`} className="blog-card-inner">
                      <div className="blog-card-cover-wrap">
                        <img
                          src={post.cover}
                          alt={post.title}
                          className="blog-card-cover-img"
                        />
                        <span className="blog-card-category-badge">
                          {post.category}
                        </span>
                      </div>

                      <div className="blog-card-content">
                        <div className="blog-card-meta">
                          <span>{post.date}</span>
                          <span className="meta-split-dot">•</span>
                          <span className="reading-time-indicator">
                            <Clock size={11} /> {post.readingTime}
                          </span>
                        </div>

                        <h3 className="blog-card-title">{post.title}</h3>
                        <p className="blog-card-excerpt">{post.excerpt}</p>

                        <div className="blog-card-footer">
                          <span className="blog-card-author">
                            By {post.author.name}
                          </span>
                          <span className="blog-card-link-arrow">
                            Read <ArrowUpRight size={14} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="filter-empty-state-luxury">
              <div className="empty-glowing-orbit">
                <BookOpen size={28} />
              </div>
              <h3>No articles found</h3>
              <p>
                No blog posts match your current search or category filter. Try clearing
                the filter to view all articles.
              </p>
              <button
                type="button"
                className="pill primary"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* Newsletter / Project Consultation Box */}
        <section className="container blog-cta-section">
          <div className="blog-cta-card">
            <div className="cta-sparkle-dot" />
            <div className="kicker">Let&apos;s collaborate</div>
            <h2>Have an ambitious project or need a design system audit?</h2>
            <p>
              I help product teams turn complex requirements into elegant, high-performing
              user experiences. Let&apos;s talk about your roadmap.
            </p>
            <div className="actions" style={{ justifyContent: "center" }}>
              <Link href="/contact" className="pill primary">
                Start a Conversation ↗
              </Link>
              <Link href="/work" className="pill">
                Explore Selected Work
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container footer">
        <span>© 2026 Muhammad Arslan</span>
        <span>UI/UX &amp; Product Designer · Sialkot, Pakistan</span>
        <SocialLinks />
      </footer>
    </>
  );
}
