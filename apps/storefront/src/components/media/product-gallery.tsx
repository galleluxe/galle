"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GalleImage } from "./galle-image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const main = images[active] ?? images[0];

  if (!main) return null;

  const handleNext = () => {
    setDirection(1);
    setActive((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActive((prev) => (prev - 1 + images.length) % images.length);
  };

  // Variants for luxury cross-fade and gentle scale zoom transition
  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.02,
      x: dir * 15,
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1], // premium custom cubic bezier
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 0.98,
      x: -dir * 15,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 select-none">
      {/* Main Large Image Display */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden ambient-shadow bg-surface-container-low group">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={active}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <GalleImage
              src={main}
              alt={alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>
        </AnimatePresence>

        {/* Delicate navigation arrows (visible on hover) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/40 backdrop-blur-md text-primary flex items-center justify-center border border-outline-variant/20 opacity-0 group-hover:opacity-100 active:scale-95 transition-all duration-300 hover:bg-surface/70"
              aria-label="Previous image"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/40 backdrop-blur-md text-primary flex items-center justify-center border border-outline-variant/20 opacity-0 group-hover:opacity-100 active:scale-95 transition-all duration-300 hover:bg-surface/70"
              aria-label="Next image"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </>
        )}

        {/* Elegant overlay counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-surface-container-highest/60 backdrop-blur-md font-label-caps text-[10px] text-on-surface tracking-widest uppercase">
            {active + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails row / Carousel Indicator Dots */}
      {images.length > 1 && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar max-w-full py-1">
            {images.map((src, i) => {
              const isSelected = i === active;
              return (
                <button
                  key={`${src}-${i}`} // UNIQUE KEY matching fix
                  type="button"
                  onClick={() => {
                    setDirection(i > active ? 1 : -1);
                    setActive(i);
                  }}
                  className={cn(
                    "relative shrink-0 w-16 aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all duration-300",
                    isSelected
                      ? "border-primary scale-105 shadow-md"
                      : "border-transparent opacity-50 hover:opacity-100 hover:scale-102"
                  )}
                >
                  <GalleImage
                    src={src}
                    alt={`${alt} thumbnail ${i + 1}`}
                    fill
                    sizes="64px"
                    rounded={false}
                  />
                </button>
              );
            })}
          </div>

          {/* Luxury dashed active dot indicators */}
          <div className="flex gap-2 justify-center items-center mt-1">
            {images.map((_, i) => (
              <button
                key={`dot-${i}`}
                type="button"
                onClick={() => {
                  setDirection(i > active ? 1 : -1);
                  setActive(i);
                }}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  i === active
                    ? "w-8 bg-primary"
                    : "w-2 bg-outline-variant hover:bg-outline"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
