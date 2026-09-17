"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Globe, Layers, Smartphone, Sparkles } from "lucide-react";
import type { Project } from "@/lib/types";

function getPlatformIcon(platform?: string) {
  switch (platform) {
    case "Mobile App":
      return <Smartphone size={11} />;
    case "Website":
      return <Globe size={11} />;
    case "Web App":
    default:
      return <Layers size={11} />;
  }
}

function normalizeImageUrl(url?: string): string {
  if (!url || typeof url !== "string" || !url.trim()) {
    return "/images/project-placeholder.svg";
  }
  const clean = url.trim();
  if (clean.startsWith("//")) {
    return `https:${clean}`;
  }
  return clean;
}

export default function ProjectCard({ p }: { p: Project }) {
  const altText = `${p.title} ${p.industry ? `${p.industry} ` : ""}${p.platform || "digital product"} interface preview`;
  const coverSrc = normalizeImageUrl(p.cover);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="project-motion-wrap"
    >
      <div className="project">
        <Link
          href={"/work/" + p.slug}
          className="project-card-overlay-link"
          aria-label={`View ${p.title} case study`}
        >
          <span className="sr-only">View {p.title} case study</span>
        </Link>
        <div className={`project-image ${p.platform === "Mobile App" ? "is-mobile-preview" : "is-browser-preview"}`}>
          {/* Native Device Mockup Header */}
          {p.platform === "Mobile App" ? (
            <div className="card-mockup-header mobile-header">
              <span className="card-mobile-notch" />
            </div>
          ) : (
            <div className="card-mockup-header browser-header">
              <div className="card-traffic-lights">
                <span className="card-dot dot-red" />
                <span className="card-dot dot-yellow" />
                <span className="card-dot dot-green" />
              </div>
              <span className="card-url-pill">{p.slug}.app</span>
            </div>
          )}

          <Image
            src={coverSrc}
            alt={altText}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="project-cover-img"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
          <div className="project-image-shade" />
          <div className="project-open">
            <span>View case study</span>
            <ArrowUpRight size={17} />
          </div>
          {p.featured && (
            <span className="project-featured-badge">
              <Sparkles size={11} /> Featured
            </span>
          )}
        </div>
        <div className="project-info">
          <div className="project-meta">
            <div className="project-tags">
              <span className="badge badge-category">{p.category}</span>
              {p.industry && (
                <span className="badge badge-industry">{p.industry}</span>
              )}
              {p.platform && (
                <span className="badge badge-platform">
                  {getPlatformIcon(p.platform)} {p.platform}
                </span>
              )}
            </div>
            <span className="project-year">{p.year}</span>
          </div>
          <h3>
            <span className="project-title-link">
              {p.title}
            </span>
          </h3>
          <p>{p.description}</p>
          <div className="project-bottom">
            <span
              className="project-bottom-link"
              aria-hidden="true"
            >
              <span>Explore case study</span>
              <span className="bottom-arrow-wrap">
                <ArrowUpRight size={16} />
              </span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
