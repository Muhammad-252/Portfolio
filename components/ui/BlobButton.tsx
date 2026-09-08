"use client";

import React from "react";
import Link from "next/link";

export interface BlobButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  blobColor?: string;
  hoverTextColor?: string;
  target?: string;
  rel?: string;
  title?: string;
  "aria-label"?: string;
}

export default function BlobButton({
  children,
  variant = "secondary",
  size = "md",
  href,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  style = {},
  blobColor,
  hoverTextColor,
  target,
  rel,
  title,
  "aria-label": ariaLabel,
}: BlobButtonProps) {
  const sizeClass = `blob-btn--${size}`;
  const variantClass = `blob-btn--${variant}`;
  const disabledClass = disabled ? "blob-btn--disabled" : "";

  const combinedClassName = `blob-btn ${variantClass} ${sizeClass} ${disabledClass} ${className}`.trim();

  const customStyles: React.CSSProperties = {
    ...style,
    ...(blobColor ? ({ "--blob-color": blobColor } as React.CSSProperties) : {}),
    ...(hoverTextColor ? ({ "--blob-hover-text": hoverTextColor } as React.CSSProperties) : {}),
  };

  const blobCustomStyle = blobColor ? { backgroundColor: blobColor } : undefined;

  const innerBlobs = (
    <span className="blob-btn__inner" aria-hidden="true">
      <span className="blob-btn__blobs">
        <span className="blob-btn__blob" style={blobCustomStyle} />
        <span className="blob-btn__blob" style={blobCustomStyle} />
        <span className="blob-btn__blob" style={blobCustomStyle} />
        <span className="blob-btn__blob" style={blobCustomStyle} />
      </span>
    </span>
  );

  const content = (
    <>
      <span className="blob-btn__content">{children}</span>
      {innerBlobs}
    </>
  );

  if (href && !disabled) {
    const isExternal = href.startsWith("http") || href.startsWith("//") || href.startsWith("mailto:") || href.startsWith("tel:");
    if (isExternal) {
      return (
        <a
          href={href}
          className={combinedClassName}
          style={customStyles}
          onClick={onClick}
          target={target}
          rel={rel || (target === "_blank" ? "noopener noreferrer" : undefined)}
          title={title}
          aria-label={ariaLabel}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={combinedClassName}
        style={customStyles}
        onClick={onClick}
        title={title}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={combinedClassName}
      style={customStyles}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
