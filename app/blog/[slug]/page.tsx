"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock,
  Calendar,
  Share2,
  Tag,
  Sparkles,
  BookOpen,
} from "lucide-react";
import Nav from "@/components/Nav";
import SocialLinks from "@/components/SocialLinks";
import { useBlogPosts } from "@/lib/useBlogPosts";

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();
  const { posts } = useBlogPosts();

  const post = useMemo(() => {
    return posts.find((p) => p.slug === params.slug);
  }, [posts, params.slug]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return posts
      .filter((p) => p.slug !== post.slug && p.published)
      .slice(0, 2);
  }, [posts, post]);

  if (!post) {
    return (
      <>
        <Nav />
        <main className="container blog-not-found">
          <div className="filter-empty-state-luxury">
            <div className="empty-glowing-orbit">
              <BookOpen size={28} />
            </div>
            <h3>Article Not Found</h3>
            <p>The requested article could not be located. It may have been moved or unpublished.</p>
            <Link href="/blog" className="pill primary">
              ← Return to Blog
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Nav />

      <main className="blog-detail-root">
        {/* Top Breadcrumb Bar */}
        <div className="container blog-breadcrumb-bar">
          <Link href="/blog" className="blog-back-link">
            <ArrowLeft size={14} />
            <span>All Articles</span>
          </Link>
          <span className="breadcrumb-divider">/</span>
          <span className="breadcrumb-current">{post.category}</span>
        </div>

        {/* Article Hero */}
        <header className="container blog-detail-header">
          <div className="detail-meta-pill-row">
            <span className="badge badge-category">{post.category}</span>
            <span className="reading-time-indicator">
              <Clock size={12} /> {post.readingTime}
            </span>
            <span className="publish-date-indicator">
              <Calendar size={12} /> {post.date}
            </span>
          </div>

          <h1 className="blog-detail-title">{post.title}</h1>
          <p className="blog-detail-lead">{post.excerpt}</p>

          {/* Author Badge Row */}
          <div className="blog-author-byline">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="byline-avatar-img"
            />
            <div className="byline-details">
              <strong className="byline-name">{post.author.name}</strong>
              <span className="byline-role">{post.author.role}</span>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <section className="container blog-cover-showcase">
          <div className="blog-cover-frame">
            <img src={post.cover} alt={post.title} className="blog-detail-cover" />
          </div>
        </section>

        {/* Article Body Content */}
        <article className="container blog-prose-container">
          <div className="blog-prose-body">
            {post.content.split("\n\n").map((paragraph, idx) => {
              const trimmed = paragraph.trim();

              // Heading 3
              if (trimmed.startsWith("### ")) {
                return (
                  <h3 key={idx} className="prose-h3">
                    {trimmed.replace("### ", "")}
                  </h3>
                );
              }

              // Blockquote
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote key={idx} className="prose-blockquote">
                    <p>{trimmed.replace(/^> \*/, "").replace(/\*$/, "").replace(/^> /, "")}</p>
                  </blockquote>
                );
              }

              // Bullet list
              if (trimmed.startsWith("- ") || trimmed.startsWith("1. ")) {
                const items = trimmed.split("\n").map((line) => line.replace(/^[-*]|\d+\.\s*/, "").trim());
                return (
                  <ul key={idx} className="prose-list">
                    {items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                );
              }

              // Regular paragraph
              return (
                <p key={idx} className="prose-paragraph">
                  {trimmed}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="blog-tags-row">
              <span className="tags-label">
                <Tag size={13} /> Tags:
              </span>
              <div className="tags-cluster">
                {post.tags.map((tag) => (
                  <span key={tag} className="article-tag-chip">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio Card */}
          <div className="author-bio-card">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="bio-avatar"
            />
            <div className="bio-info">
              <div className="bio-header-row">
                <div>
                  <h4 className="bio-name">{post.author.name}</h4>
                  <span className="bio-role">{post.author.role}</span>
                </div>
                <Link href="/contact" className="pill bio-contact-btn">
                  Work With Me ↗
                </Link>
              </div>
              <p className="bio-desc">
                Specialized in high-density web apps, design systems, and converting
                ambiguous product specs into intuitive, scalable digital experiences.
                Based in Pakistan, collaborating with founders worldwide.
              </p>
            </div>
          </div>
        </article>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section className="container blog-related-section">
            <div className="section-head">
              <div>
                <div className="kicker">Further Reading</div>
                <h2>Related perspectives.</h2>
              </div>
              <div className="section-head-side">
                <Link href="/blog" className="pill">
                  View All Articles ↗
                </Link>
              </div>
            </div>

            <div className="related-articles-grid">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="related-article-card"
                >
                  <div className="related-thumb-wrap">
                    <img src={rel.cover} alt={rel.title} />
                    <span className="badge badge-category">{rel.category}</span>
                  </div>
                  <div className="related-details">
                    <div className="related-meta">
                      <span>{rel.date}</span>
                      <span>•</span>
                      <span>{rel.readingTime}</span>
                    </div>
                    <h3>{rel.title}</h3>
                    <span className="related-arrow">
                      Read article <ArrowUpRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Conversion CTA */}
        <section className="container blog-bottom-cta">
          <div className="blog-cta-card">
            <div className="kicker">Next Steps</div>
            <h2>Need a seasoned designer to elevate your product?</h2>
            <p>
              Whether you need an end-to-end web app design, a battle-tested design system,
              or an expert UX audit, let&apos;s build something exceptional together.
            </p>
            <div className="actions" style={{ justifyContent: "center" }}>
              <Link href="/contact" className="pill primary">
                Start a Project ↗
              </Link>
              <Link href="/work" className="pill">
                View Case Studies
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
