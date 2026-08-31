"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function ProjectGallery({ images }: { images: string[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const previous = () =>
    setIndex((value) =>
      value === null ? null : (value - 1 + images.length) % images.length,
    );
  const next = () =>
    setIndex((value) => (value === null ? null : (value + 1) % images.length));
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIndex(null);
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);
  if (!images.length) return null;
  return (
    <section className="project-gallery">
      <div className="gallery-heading">
        <div>
          <div className="kicker">Project gallery</div>
          <h2>See the details.</h2>
        </div>
        <span>{images.length} screens</span>
      </div>
      <div className="gallery-grid">
        {images.map((image, imageIndex) => (
          <button
            type="button"
            key={image}
            className="gallery-thumb"
            onClick={() => setIndex(imageIndex)}
          >
            <img src={image} alt={"Project screen " + (imageIndex + 1)} />
            <span>View full screen</span>
          </button>
        ))}
      </div>
      {index !== null && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setIndex(null)}
          onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
          onTouchEnd={(event) => {
            const delta =
              event.changedTouches[0].clientX -
              (touchStart ?? event.changedTouches[0].clientX);
            if (Math.abs(delta) > 45) {
              event.stopPropagation();
              delta > 0 ? previous() : next();
            }
            setTouchStart(null);
          }}
        >
          <button
            className="gallery-close"
            onClick={() => setIndex(null)}
            aria-label="Close gallery"
          >
            <X />
          </button>
          <button
            className="gallery-nav gallery-prev"
            onClick={(event) => {
              event.stopPropagation();
              previous();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft />
          </button>
          <img
            src={images[index]}
            alt={"Project screen " + (index + 1)}
            onClick={(event) => event.stopPropagation()}
          />
          <button
            className="gallery-nav gallery-next"
            onClick={(event) => {
              event.stopPropagation();
              next();
            }}
            aria-label="Next image"
          >
            <ChevronRight />
          </button>
          <span className="gallery-count">
            {index + 1} / {images.length}
          </span>
        </div>
      )}
    </section>
  );
}
