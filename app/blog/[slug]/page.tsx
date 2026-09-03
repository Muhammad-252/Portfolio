"use client";

import { useMemo, useEffect, ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock,
  Calendar,
  Tag,
  BookOpen,
} from "lucide-react";
import Nav from "@/components/Nav";
import SocialLinks from "@/components/SocialLinks";
import { useBlogPosts } from "@/lib/useBlogPosts";

function renderInline(text: string): ReactNode {
  const parts: (string | ReactNode)[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    if (match[1] && match[2]) {
      const isInternal = match[2].startsWith("/");
      parts.push(
        isInternal ? (
          <Link key={match.index} href={match[2]} className="prose-link">
            {match[1]}
          </Link>
        ) : (
          <a
            key={match.index}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="prose-link"
          >
            {match[1]}
          </a>
        )
      );
    } else if (match[3]) {
      parts.push(<strong key={match.index}>{match[3]}</strong>);
    } else if (match[4]) {
      parts.push(
        <code key={match.index} className="prose-code">
          {match[4]}
        </code>
      );
    } else if (match[5]) {
      parts.push(<em key={match.index}>{match[5]}</em>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

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

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Muhammad Arslan`;
    }
  }, [post]);

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

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
      url: "https://portfolio-smoky-sigma-eatwqaaxyp.vercel.app",
    },
    publisher: {
      "@type": "Person",
      name: "Muhammad Arslan",
      url: "https://portfolio-smoky-sigma-eatwqaaxyp.vercel.app",
    },
    datePublished: "2026-03-03T00:00:00+05:00",
    dateModified: "2026-03-03T00:00:00+05:00",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://portfolio-smoky-sigma-eatwqaaxyp.vercel.app/blog/${post.slug}`,
    },
    keywords: post.tags?.join(", "),
  };

  return (
    <>
      <Nav />

      {/* Technical SEO: Schema.org BlogPosting Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <main className="blog-detail-root">
        <div className="container blog-detail-container">
          {/* Top Breadcrumb Bar */}
          <div className="blog-breadcrumb-bar">
            <Link href="/blog" className="blog-back-link">
              <ArrowLeft size={14} />
              <span>All Articles</span>
            </Link>
            <span className="breadcrumb-divider">/</span>
            <span className="breadcrumb-current">{post.category}</span>
          </div>

          {/* Article Hero */}
          <header className="blog-detail-header">
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

          {/* Featured Cover Image (Same Width as Content) */}
          <section className="blog-cover-showcase">
            <div className="blog-cover-frame">
              <img src={post.cover} alt={post.title} className="blog-detail-cover" />
            </div>
          </section>

          {/* Article Body Content */}
          <article className="blog-prose-container">
            <div className="blog-prose-body">
              {post.content.split("\n\n").map((paragraph, idx) => {
                const trimmed = paragraph.trim();

                // Horizontal Rule
                if (trimmed === "---") {
                  return <hr key={idx} className="prose-hr" />;
                }

                // Heading 2
                if (trimmed.startsWith("## ")) {
                  return (
                    <h2 key={idx} className="prose-h2">
                      {trimmed.replace("## ", "")}
                    </h2>
                  );
                }

                // Heading 3
                if (trimmed.startsWith("### ")) {
                  return (
                    <h3 key={idx} className="prose-h3">
                      {trimmed.replace("### ", "")}
                    </h3>
                  );
                }

                // Markdown Table
                if (trimmed.startsWith("|")) {
                  const lines = trimmed.split("\n").filter((l) => l.trim().startsWith("|"));
                  if (lines.length >= 2) {
                    const headerCells = lines[0]
                      .split("|")
                      .map((c) => c.trim())
                      .filter(Boolean);
                    const dataLines = lines.slice(1).filter((l) => !l.includes("---"));

                    return (
                      <div key={idx} className="prose-table-wrap">
                        <table className="prose-table">
                          <thead>
                            <tr>
                              {headerCells.map((h, hIdx) => (
                                <th key={hIdx}>{renderInline(h)}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {dataLines.map((row, rIdx) => {
                              const cells = row
                                .split("|")
                                .map((c) => c.trim())
                                .filter(Boolean);
                              return (
                                <tr key={rIdx}>
                                  {cells.map((cell, cIdx) => (
                                    <td key={cIdx}>{renderInline(cell)}</td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                }

                // Code block
                if (trimmed.startsWith("```")) {
                  const code = trimmed.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "");
                  return (
                    <pre key={idx} className="prose-pre">
                      <code>{code}</code>
                    </pre>
                  );
                }

                // Blockquote
                if (trimmed.startsWith("> ")) {
                  const quoteText = trimmed
                    .replace(/^> \*/, "")
                    .replace(/\*$/, "")
                    .replace(/^> /, "");
                  return (
                    <blockquote key={idx} className="prose-blockquote">
                      <p>{renderInline(quoteText)}</p>
                    </blockquote>
                  );
                }

                // Bullet list
                if (trimmed.startsWith("- ") || trimmed.startsWith("1. ")) {
                  const items = trimmed.split("\n").map((line) => line.replace(/^[-*]|\d+\.\s*/, "").trim());
                  return (
                    <ul key={idx} className="prose-list">
                      {items.map((item, itemIdx) => (
                        <li key={itemIdx}>{renderInline(item)}</li>
                      ))}
                    </ul>
                  );
                }

                // Regular paragraph
                return (
                  <p key={idx} className="prose-paragraph">
                    {renderInline(trimmed)}
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
            <section className="blog-related-section">
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
          <section className="blog-bottom-cta">
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
        </div>
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
