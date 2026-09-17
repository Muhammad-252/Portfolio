"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Play,
  Pause,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectGalleryProps {
  images: string[];
  title?: string;
  platform?: string;
  slug?: string;
}

function normalizeImg(src?: string) {
  if (!src) return "/images/project-placeholder.svg";
  if (src.startsWith("//")) return "https:" + src;
  return src;
}

export default function ProjectGallery({
  images,
  title,
  platform,
  slug,
}: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [modalTouchStartX, setModalTouchStartX] = useState<number | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const count = images.length;

  // Circular navigation helpers
  const goToNext = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  const goToPrev = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Pause auto-rotation temporarily after manual click
  const handleManualNav = useCallback(
    (action: "next" | "prev" | number) => {
      if (typeof action === "number") {
        setActiveIndex(action);
      } else if (action === "next") {
        goToNext();
      } else {
        goToPrev();
      }

      // Pause for 6 seconds on manual interaction, then resume
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      setIsPlaying(false);
      pauseTimeoutRef.current = setTimeout(() => {
        setIsPlaying(true);
      }, 6000);
    },
    [goToNext, goToPrev]
  );

  // Auto-slide effect
  useEffect(() => {
    if (!isPlaying || isHovered || lightboxIndex !== null || count <= 1) return;

    const timer = setInterval(() => {
      goToNext();
    }, 3600);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, lightboxIndex, count, goToNext]);

  // Keyboard navigation for lightbox & carousel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === "Escape") setLightboxIndex(null);
        if (e.key === "ArrowRight")
          setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % count));
        if (e.key === "ArrowLeft")
          setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + count) % count));
      } else {
        if (e.key === "ArrowRight") handleManualNav("next");
        if (e.key === "ArrowLeft") handleManualNav("prev");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, count, handleManualNav]);

  if (!images || images.length === 0) return null;

  return (
    <section
      className="project-gallery-carousel-root"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Project circular gallery"
    >
      {/* Header Row */}
      <div className="gallery-carousel-header">
        <div>
          <div className="curated-badge" style={{ marginBottom: 10 }}>
            <Layers size={12} />
            <span>Interactive Showcase</span>
          </div>
          <h2 className="gallery-carousel-title">
            Project Gallery<i>.</i>
          </h2>
        </div>

        <div className="gallery-carousel-meta">
          {/* Autoplay status toggle */}
          {count > 1 && (
            <button
              type="button"
              className={`gallery-autoplay-toggle ${isPlaying ? "active" : ""}`}
              onClick={() => setIsPlaying((p) => !p)}
              title={isPlaying ? "Pause auto-rotation" : "Resume auto-rotation"}
              aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              <span>{isPlaying ? "Auto Rotating" : "Paused"}</span>
            </button>
          )}

          <div className="gallery-count-pill">
            <span className="count-current">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="count-divider">/</span>
            <span className="count-total">
              {String(count).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* 3D Circular Stage */}
      <div
        className="circular-stage-viewport"
        onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX === null) return;
          const diff = e.changedTouches[0].clientX - touchStartX;
          if (Math.abs(diff) > 40) {
            diff > 0 ? handleManualNav("prev") : handleManualNav("next");
          }
          setTouchStartX(null);
        }}
      >
        {/* Subtle circular orbital ring glow in background */}
        <div className="circular-stage-orbit-ring" aria-hidden="true" />

        {/* Circular Cards Arc */}
        <div className="circular-stage-track">
          {images.map((imgSrc, idx) => {
            // Calculate circular offset relative to activeIndex
            let offset = idx - activeIndex;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;

            const isCenter = offset === 0;
            const isImmediateLeft = offset === -1;
            const isImmediateRight = offset === 1;
            const isSecondLeft = offset === -2;
            const isSecondRight = offset === 2;

            // Only render items within 2 steps of center to keep performance ultra-high
            const isVisible = Math.abs(offset) <= 2;
            if (!isVisible) return null;

            return (
              <div
                key={imgSrc + idx}
                className={`circular-slide-item ${isCenter ? "is-center" : ""} ${
                  isImmediateLeft ? "is-prev" : ""
                } ${isImmediateRight ? "is-next" : ""} ${
                  isSecondLeft || isSecondRight ? "is-far" : ""
                }`}
                style={{
                  transform: `translate3d(calc(-50% + ${
                    offset * 48
                  }%), -50%, ${-Math.abs(offset) * 80}px) rotateY(${
                    offset * -18
                  }deg) scale(${1 - Math.abs(offset) * 0.16})`,
                  zIndex: 20 - Math.abs(offset) * 4,
                  opacity: Math.max(0, 1 - Math.abs(offset) * 0.42),
                }}
                onClick={() => {
                  if (isCenter) {
                    setLightboxIndex(idx);
                  } else {
                    handleManualNav(idx);
                  }
                }}
              >
                <div className={`circular-card-inner ${platform === "Mobile App" ? "is-mobile-card" : "is-linear-card"}`}>
                  {platform === "Mobile App" ? (
                    <div className="card-mockup-header mobile-header">
                      <span className="card-mobile-notch" />
                    </div>
                  ) : (
                    <div className="card-mockup-header linear-header">
                      <div className="linear-header-left">
                        <span className="linear-status-dot" />
                        <span className="linear-breadcrumb-pill">
                          {(slug || "app")} <span className="slash">/</span> screen-{String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="linear-header-right">
                        <span className="linear-cmd-pill">⌘K</span>
                      </div>
                    </div>
                  )}

                  <div className="circular-card-screen">
                    <img
                      src={normalizeImg(imgSrc)}
                      alt={`${title || "Project"} showcase screen ${idx + 1}`}
                      loading={isCenter ? "eager" : "lazy"}
                      decoding="async"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src && !target.src.endsWith("/images/project-placeholder.svg")) {
                          target.src = "/images/project-placeholder.svg";
                        }
                      }}
                    />
                    <div className="device-screen-glare" />

                    {/* Active Card Overlay & Prompt */}
                    {isCenter && (
                      <div className="circular-card-active-overlay">
                        <div className="circular-expand-pill">
                          <Maximize2 size={13} />
                          <span>Click to Expand</span>
                        </div>
                      </div>
                    )}

                    {/* Side Card subtle click prompt */}
                    {!isCenter && (
                      <div className="circular-card-flank-tint" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Circular Manual Arrow Buttons */}
        {count > 1 && (
          <>
            <button
              type="button"
              className="circular-nav-btn prev-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleManualNav("prev");
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="circular-nav-btn next-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleManualNav("next");
              }}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Bottom Track Pagination Indicators */}
      {count > 1 && (
        <div className="circular-pagination-track">
          {images.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              className={`circular-dot ${dotIdx === activeIndex ? "active" : ""}`}
              onClick={() => handleManualNav(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Lightbox Modal (Preserved & Enhanced) */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Image preview lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            onClick={() => setLightboxIndex(null)}
            onTouchStart={(e) => setModalTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (modalTouchStartX === null) return;
              const delta = e.changedTouches[0].clientX - modalTouchStartX;
              if (Math.abs(delta) > 45) {
                e.stopPropagation();
                if (delta > 0) {
                  setLightboxIndex((prev) =>
                    prev === null ? null : (prev - 1 + count) % count
                  );
                } else {
                  setLightboxIndex((prev) =>
                    prev === null ? null : (prev + 1) % count
                  );
                }
              }
              setModalTouchStartX(null);
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              className="gallery-close"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close image preview"
            >
              <X size={20} />
            </button>

            {/* Modal Previous Arrow */}
            {count > 1 && (
              <button
                type="button"
                className="gallery-nav gallery-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev === null ? null : (prev - 1 + count) % count
                  );
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Modal Image inside Full Mockup */}
            <motion.div
              className="lightbox-image-wrap"
              key={lightboxIndex}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {platform === "Mobile App" ? (
                <div className="device-mockup-mobile lightbox-mobile-frame">
                  <div className="mobile-bezel-top">
                    <span className="mobile-dynamic-island" />
                    <span className="mobile-camera-lens" />
                  </div>
                  <div className="mobile-screen-content">
                    <img
                      src={normalizeImg(images[lightboxIndex])}
                      alt={`${title || "Project"} screen ${lightboxIndex + 1}`}
                      className="lightbox-main-img"
                    />
                    <div className="device-screen-glare" />
                  </div>
                  <div className="mobile-bezel-bottom">
                    <span className="mobile-home-bar" />
                  </div>
                </div>
              ) : (
                <div className="device-shell-linear lightbox-linear-frame">
                  <div className="linear-laser-line" />
                  <div className="linear-shell-topbar">
                    <div className="linear-topbar-left">
                      <span className="linear-pulse-dot" />
                      <div className="linear-breadcrumbs">
                        <span className="breadcrumb-root">{slug || "project"}</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-sub">screens</span>
                        <span className="breadcrumb-separator">/</span>
                        <span className="breadcrumb-active">
                          {String(lightboxIndex + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    <div className="linear-topbar-center">
                      <div className="linear-command-pill">
                        <span className="cmd-symbol">⌘</span>
                        <span className="cmd-key">K Command Palette</span>
                      </div>
                    </div>

                    <div className="linear-topbar-right">
                      <span className="linear-live-indicator">FULL VIEW</span>
                    </div>
                  </div>

                  <div className="linear-shell-viewport">
                    <img
                      src={normalizeImg(images[lightboxIndex])}
                      alt={`${title || "Project"} screen ${lightboxIndex + 1}`}
                      className="lightbox-main-img"
                    />
                    <div className="linear-viewport-sheen" />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Modal Next Arrow */}
            {count > 1 && (
              <button
                type="button"
                className="gallery-nav gallery-next"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev === null ? null : (prev + 1) % count
                  );
                }}
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* Counter Badge */}
            <div className="gallery-count">
              <span>{lightboxIndex + 1}</span>
              <span>/</span>
              <span>{count}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
