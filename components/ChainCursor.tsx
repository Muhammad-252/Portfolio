"use client";

import React, { useEffect, useRef } from "react";

interface ChainCursorProps {
  mouseSpeed?: number;
  chainSpeed?: number;
  gapSteps?: number;
  lineColor?: string;
  lineWidth?: number;
}

export default function ChainCursor({
  mouseSpeed = 0.2, // First badge chase speed
  chainSpeed = 0.35, // Chain reaction speed
  gapSteps = 4, // Distance between badges (~95px with 4)
  lineColor = "#ffffff",
  lineWidth = 2.5,
}: ChainCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const badgesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Disable on touch / mobile devices or if user prefers reduced motion
    if (
      typeof window === "undefined" ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const numBadges = badgesRef.current.filter(Boolean).length || 4;
    const totalPoints = (numBadges - 1) * gapSteps + 1;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const points = Array.from({ length: totalPoints }, () => ({
      x: mouse.x,
      y: mouse.y,
    }));

    let isVisible = false;
    let isHoveringInteractive = false;
    let animationFrameId: number;

    const interactiveSelector =
      "a, button, [role='button'], input, textarea, select, [data-cursor-hide='true']";

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (!isVisible) {
        isVisible = true;
        points.forEach((p) => {
          p.x = mouse.x;
          p.y = mouse.y;
        });
      }

      // Detect hover over interactive elements
      const target = e.target as HTMLElement | null;
      isHoveringInteractive = Boolean(target && target.closest(interactiveSelector));
    };

    const onMouseLeave = () => {
      isVisible = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    const loop = () => {
      if (containerRef.current) {
        containerRef.current.style.opacity = isVisible && !isHoveringInteractive ? "1" : "0";
      }

      if (isVisible) {
        // 1. First badge chases the mouse cursor
        points[0].x += (mouse.x - points[0].x) * mouseSpeed;
        points[0].y += (mouse.y - points[0].y) * mouseSpeed;

        // 2. Chained physics through intermediate steps
        for (let i = 1; i < totalPoints; i++) {
          points[i].x += (points[i - 1].x - points[i].x) * chainSpeed;
          points[i].y += (points[i - 1].y - points[i].y) * chainSpeed;
        }

        // 3. Move each badge to its sampled point along the chain
        badgesRef.current.forEach((badge, i) => {
          if (!badge) return;
          const pt = points[i * gapSteps];
          if (pt) {
            badge.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) translate(-50%, -50%)`;
          }
        });

        // 4. Draw smooth Bézier curve starting at Badge 0 to Badge 3
        if (pathRef.current) {
          let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
          for (let i = 0; i < totalPoints - 1; i++) {
            const current = points[i];
            const next = points[i + 1];
            const midX = ((current.x + next.x) / 2).toFixed(1);
            const midY = ((current.y + next.y) / 2).toFixed(1);
            d += ` Q ${current.x.toFixed(1)} ${current.y.toFixed(1)} ${midX} ${midY}`;
          }
          const last = points[totalPoints - 1];
          d += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;

          pathRef.current.setAttribute("d", d);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [mouseSpeed, chainSpeed, gapSteps]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="chain-cursor-container fixed inset-0 pointer-events-none z-[99999] opacity-0 transition-opacity duration-200 ease-out max-md:hidden"
    >
      {/* Dynamic Connecting SVG Line */}
      <svg className="chain-cursor-svg absolute inset-0 w-full h-full pointer-events-none">
        <path
          ref={pathRef}
          fill="none"
          stroke={lineColor}
          strokeWidth={lineWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 2px 5px rgba(56, 189, 248, 0.35))" }}
        />
      </svg>

      {/* 1. Pen Tool (UI/UX Vector Design) */}
      <div
        ref={(el) => {
          badgesRef.current[0] = el;
        }}
        className="chain-cursor-badge-item absolute top-0 left-0 will-change-transform z-[1004]"
        style={{ zIndex: 1004 }}
      >
        <div className="chain-cursor-badge w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-white/40 shadow-[0_4px_14px_rgba(0,0,0,0.25)] flex items-center justify-center">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
        </div>
      </div>

      {/* 2. Code Brackets (Frontend Development) */}
      <div
        ref={(el) => {
          badgesRef.current[1] = el;
        }}
        className="chain-cursor-badge-item absolute top-0 left-0 will-change-transform z-[1003]"
        style={{ zIndex: 1003 }}
      >
        <div className="chain-cursor-badge w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-white/40 shadow-[0_4px_14px_rgba(0,0,0,0.25)] flex items-center justify-center">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
      </div>

      {/* 3. Layers (Design Systems & Wireframing) */}
      <div
        ref={(el) => {
          badgesRef.current[2] = el;
        }}
        className="chain-cursor-badge-item absolute top-0 left-0 will-change-transform z-[1002]"
        style={{ zIndex: 1002 }}
      >
        <div className="chain-cursor-badge w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-white/40 shadow-[0_4px_14px_rgba(0,0,0,0.25)] flex items-center justify-center">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>
      </div>

      {/* 4. Lightning (Interactive Prototyping) */}
      <div
        ref={(el) => {
          badgesRef.current[3] = el;
        }}
        className="chain-cursor-badge-item absolute top-0 left-0 will-change-transform z-[1001]"
        style={{ zIndex: 1001 }}
      >
        <div className="chain-cursor-badge w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-white/40 shadow-[0_4px_14px_rgba(0,0,0,0.25)] flex items-center justify-center">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
      </div>
    </div>
  );
}
