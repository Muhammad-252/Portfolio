"use client";

import React from "react";

interface IPhoneMockupProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export default function IPhoneMockup({
  src,
  alt,
  className = "",
  fallbackSrc = "/images/project-placeholder.svg",
}: IPhoneMockupProps) {
  return (
    <div className={`iphone-device-wrapper ${className}`}>
      <div className="iphone-device-container">
        {/* Titanium Outer Frame */}
        <div className="iphone-outer-frame">
          {/* Top Dynamic Island */}
          <div className="iphone-island-bar">
            <div className="iphone-dynamic-island">
              <span className="iphone-camera-sensor" />
            </div>
          </div>

          {/* OLED Screen Content */}
          <div className="iphone-screen">
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
            <div className="iphone-screen-sheen" />
          </div>

          {/* Bottom Home Indicator */}
          <div className="iphone-home-bar">
            <span className="home-line" />
          </div>
        </div>

        {/* Realistic Ambient Floor Shadow */}
        <div className="iphone-floor-shadow" aria-hidden="true" />
      </div>
    </div>
  );
}
