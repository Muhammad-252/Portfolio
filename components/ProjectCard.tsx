import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";

export default function ProjectCard({ p }: { p: Project }) {
  return (
    <Link href={"/work/" + p.slug} className="project">
      <div className="project-image">
        <img src={p.cover} alt={p.title} />
        <div className="project-image-shade" />
        <div className="project-open">
          <span>View case study</span>
          <ArrowUpRight size={17} />
        </div>
      </div>
      <div className="project-info">
        <div className="project-meta">
          <span>{p.category}</span>
          <span>{p.year}</span>
        </div>
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        <div className="project-bottom">
          <span>Explore project</span>
          <ArrowUpRight size={16} />
        </div>
      </div>
    </Link>
  );
}
