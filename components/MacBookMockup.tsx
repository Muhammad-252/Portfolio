"use client";

import React from "react";

interface MacBookMockupProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export default function MacBookMockup({
  src,
  alt,
  className = "",
  fallbackSrc = "/images/project-placeholder.svg",
}: MacBookMockupProps) {
  return (
    <div className={`macbook-device-wrapper ${className}`}>
      <div className="macbook-device-container">
        {/* Screen / Lid */}
        <div className="macbook-lid">
          {/* Top Bezel with Camera */}
          <div className="macbook-lid-top">
            <span className="macbook-camera-dot" />
          </div>

          {/* Actual Screen Display */}
          <div className="macbook-screen">
            <img
              src={src}
              alt={alt}
              style={{ objectPosition: "top center", objectFit: "cover" }}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src && !target.src.endsWith(fallbackSrc)) {
                  target.src = fallbackSrc;
                }
              }}
            />
            {/* Glossy Screen Glare */}
            <div className="macbook-glare" />
          </div>

          {/* Bottom Bezel with MacBook Branding */}
          <div className="macbook-lid-bottom">
            <span className="macbook-brand-text">MacBook</span>
          </div>
        </div>

        {/* Lower Aluminum Keyboard Deck / Base */}
        <div className="macbook-base">
          {/* Center Thumb Notch for Opening Lid */}
          <div className="macbook-notch" />
        </div>

        {/* Realistic Ambient Floor Shadow */}
        <div className="macbook-floor-shadow" aria-hidden="true" />
      </div>
    </div>
  );
}
