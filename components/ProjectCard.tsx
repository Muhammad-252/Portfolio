"use client";

import Link from "next/link";
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

export default function ProjectCard({ p }: { p: Project }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="project-motion-wrap"
    >
      <Link href={"/work/" + p.slug} className="project">
        <div className="project-image">
          <img src={p.cover} alt={p.title} loading="lazy" />
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
              {p.industry && <span className="badge badge-industry">{p.industry}</span>}
              {p.platform && (
                <span className="badge badge-platform">
                  {getPlatformIcon(p.platform)} {p.platform}
                </span>
              )}
            </div>
            <span className="project-year">{p.year}</span>
          </div>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <div className="project-bottom">
            <span>Explore case study</span>
            <span className="bottom-arrow-wrap">
              <ArrowUpRight size={16} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
