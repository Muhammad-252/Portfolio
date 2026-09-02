"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  X,
  Building2,
  MonitorSmartphone,
  Globe,
  Layers,
  Smartphone,
  Sparkles,
  Filter,
} from "lucide-react";
import Nav from "@/components/Nav";
import ProjectCard from "@/components/ProjectCard";
import CustomFilterDropdown, { DropdownOption } from "@/components/CustomFilterDropdown";
import { usePortfolioProjects } from "@/lib/usePortfolioProjects";
import { useIndustries } from "@/lib/useIndustries";
import { DEFAULT_MAIN_CATEGORIES, PLATFORM_OPTIONS } from "@/lib/categories";

export default function WorkPage() {
  const [category, setCategory] = useState<string>("All");
  const [industry, setIndustry] = useState<string>("All");
  const [platform, setPlatform] = useState<string>("All");

  const projects = usePortfolioProjects();
  const { industries: managedIndustries } = useIndustries();

  // Distinct category list
  const categories = useMemo(() => {
    const set = new Set<string>(["All", ...DEFAULT_MAIN_CATEGORIES]);
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  // Dynamic industry options formatted for custom dropdown
  const industryOptions: DropdownOption[] = useMemo(() => {
    const set = new Set<string>(managedIndustries);
    projects.forEach((p) => {
      if (p.industry) set.add(p.industry);
    });
    const sorted = Array.from(set).sort((a, b) => a.localeCompare(b));

    return [
      {
        value: "All",
        label: `All Industries (${sorted.length})`,
        count: projects.length,
      },
      ...sorted.map((ind) => ({
        value: ind,
        label: ind,
        count: projects.filter((p) => p.industry === ind).length,
      })),
    ];
  }, [managedIndustries, projects]);

  // Platform options formatted for custom dropdown with icons
  const platformOptions: DropdownOption[] = useMemo(() => {
    const getIcon = (val: string) => {
      if (val === "Website") return <Globe size={13} />;
      if (val === "Web App") return <Layers size={13} />;
      if (val === "Mobile App") return <Smartphone size={13} />;
      return <MonitorSmartphone size={13} />;
    };

    return [
      {
        value: "All",
        label: "All Platforms",
        count: projects.length,
        icon: <MonitorSmartphone size={13} />,
      },
      ...PLATFORM_OPTIONS.map((plat) => ({
        value: plat,
        label: plat,
        count: projects.filter((p) => p.platform === plat).length,
        icon: getIcon(plat),
      })),
    ];
  }, [projects]);

  // Multi-faceted intersection filtering
  const visibleProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchCat = category === "All" || project.category === category;
      const matchInd = industry === "All" || project.industry === industry;
      const matchPlat = platform === "All" || project.platform === platform;
      return matchCat && matchInd && matchPlat;
    });
  }, [projects, category, industry, platform]);

  const hasActiveFilters = category !== "All" || industry !== "All" || platform !== "All";

  const resetFilters = () => {
    setCategory("All");
    setIndustry("All");
    setPlatform("All");
  };

  return (
    <>
      <Nav />
      <main className="container work-page">
        {/* Page Header with subtle staggered entrance */}
        <motion.div
          className="work-page-intro"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-kicker-row">
            <div className="kicker">Curated Portfolio</div>
            <span className="curated-badge">
              <Sparkles size={12} /> Selected Case Studies
            </span>
          </div>
          <h1>Crafted with intention.</h1>
          <p>
            Explore client interfaces, digital products, and high-conversion web architectures.
            Filter dynamically by <strong>Main Category</strong>, <strong>Dynamic Industry</strong>,
            and <strong>Platform Type</strong>.
          </p>
        </motion.div>

        {/* Master Designer Filter Suite */}
        <motion.section
          className="luxury-filter-suite"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Portfolio filters"
        >
          {/* Top Tier: Floating Category Segmented Control */}
          <div className="filter-tier-primary">
            <div className="filter-dock-label">
              <span>Category</span>
            </div>
            <div className="category-pill-track" role="tablist">
              {categories.map((item) => {
                const isActive = category === item;
                const count =
                  item === "All"
                    ? projects.length
                    : projects.filter((p) => p.category === item).length;

                return (
                  <button
                    type="button"
                    key={item}
                    role="tab"
                    aria-selected={isActive}
                    className={`category-pill-btn ${isActive ? "active" : ""}`}
                    onClick={() => setCategory(item)}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryHighlight"
                        className="active-pill-bg"
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 35,
                        }}
                      />
                    )}
                    <span className="pill-text">{item}</span>
                    <span className="pill-count-bubble">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Tier: Custom Designer Dropdowns & Reset */}
          <div className="filter-tier-secondary">
            <div className="filter-controls-cluster">
              {/* Dynamic Industry Filter */}
              <CustomFilterDropdown
                id="filter-industry"
                label="Industry"
                icon={<Building2 size={14} />}
                value={industry}
                options={industryOptions}
                onChange={setIndustry}
                searchable={true}
                searchPlaceholder="Search 13+ industries..."
                allLabel="All Industries"
              />

              {/* Platform / Product Type Filter */}
              <CustomFilterDropdown
                id="filter-platform"
                label="Platform"
                icon={<MonitorSmartphone size={14} />}
                value={platform}
                options={platformOptions}
                onChange={setPlatform}
                searchable={false}
                allLabel="All Platforms"
              />
            </div>

            {/* Clear All Trigger */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  type="button"
                  className="luxury-clear-btn"
                  onClick={resetFilters}
                  initial={{ opacity: 0, scale: 0.9, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 10 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                >
                  <RotateCcw size={13} className="clear-icon" />
                  <span>Reset filters</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Active Chips & Counter Strip */}
          <div className="filter-status-strip">
            <div className="live-counter-wrap">
              <span className="live-pulse-dot" />
              <span className="counter-text">
                Showing <strong>{visibleProjects.length}</strong> of {projects.length} case studies
              </span>
            </div>

            <AnimatePresence>
              {hasActiveFilters && (
                <motion.div
                  className="active-filter-chips-list"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {category !== "All" && (
                    <motion.span
                      layout
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      className="active-tag-chip"
                    >
                      <span className="chip-label">Category:</span>
                      <strong className="chip-val">{category}</strong>
                      <button
                        type="button"
                        onClick={() => setCategory("All")}
                        aria-label={`Remove ${category} filter`}
                      >
                        <X size={11} />
                      </button>
                    </motion.span>
                  )}

                  {industry !== "All" && (
                    <motion.span
                      layout
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      className="active-tag-chip"
                    >
                      <span className="chip-label">Industry:</span>
                      <strong className="chip-val">{industry}</strong>
                      <button
                        type="button"
                        onClick={() => setIndustry("All")}
                        aria-label={`Remove ${industry} filter`}
                      >
                        <X size={11} />
                      </button>
                    </motion.span>
                  )}

                  {platform !== "All" && (
                    <motion.span
                      layout
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      className="active-tag-chip"
                    >
                      <span className="chip-label">Platform:</span>
                      <strong className="chip-val">{platform}</strong>
                      <button
                        type="button"
                        onClick={() => setPlatform("All")}
                        aria-label={`Remove ${platform} filter`}
                      >
                        <X size={11} />
                      </button>
                    </motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Animated Project Grid */}
        <motion.div layout className="projects work-grid">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id || project.slug} p={project} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Creative Empty State */}
        {visibleProjects.length === 0 && (
          <motion.div
            className="filter-empty-state-luxury"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="empty-glowing-orbit">
              <Filter size={28} />
            </div>
            <h3>No matching projects found</h3>
            <p>
              No projects currently match the active combination of{" "}
              <strong>{category !== "All" ? category : "all categories"}</strong> in{" "}
              <strong>{industry !== "All" ? industry : "any industry"}</strong> on{" "}
              <strong>{platform !== "All" ? platform : "any platform"}</strong>.
            </p>
            <button type="button" className="pill primary" onClick={resetFilters}>
              <RotateCcw size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
              Reset all filters
            </button>
          </motion.div>
        )}
      </main>
    </>
  );
}
