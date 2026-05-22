"use client";

import { useEffect, useState, useRef } from "react";
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
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomScale, setZoomScale] = useState(1); // Scale inside lightbox: 1x, 2x, 3x

  // Touch Swipe Gesture State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 40; // pixels

  const main = images[active] ?? images[0];

  // Auto-play effect with 2s interval
  useEffect(() => {
    if (images.length <= 1 || !isAutoplay) return;

    const interval = setInterval(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length, isAutoplay]);

  if (!main) return null;

  const handleNext = () => {
    setIsAutoplay(false); // Stop autoplay on interaction
    setDirection(1);
    setActive((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setIsAutoplay(false); // Stop autoplay on interaction
    setDirection(-1);
    setActive((prev) => (prev - 1 + images.length) % images.length);
  };

  // Touch handlers for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsAutoplay(false); // Touch interaction stops autoplay
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  // Variants for luxury cross-fade transition
  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.01,
      x: dir * 10,
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 0.99,
      x: -dir * 10,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 select-none">
      {/* Main Large Image Display */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          setIsAutoplay(false);
          setIsLightboxOpen(true);
        }}
        className="relative aspect-[3/4] rounded-2xl overflow-hidden ambient-shadow bg-surface-container-low group cursor-zoom-in"
      >
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
              className="object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </motion.div>
        </AnimatePresence>

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
                  key={`${src}-${i}`}
                  type="button"
                  onClick={() => {
                    setIsAutoplay(false); // Stop autoplay on interaction
                    setDirection(i > active ? 1 : -1);
                    setActive(i);
                  }}
                  className={cn(
                    "relative shrink-0 w-16 aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all duration-300",
                    isSelected
                      ? "border-primary scale-105 shadow-md"
                      : "border-transparent opacity-50 hover:opacity-100"
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
                  setIsAutoplay(false); // Stop autoplay
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

      {/* Premium Lightbox Zoom Overlay */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-md select-none touch-none"
          >
            {/* Header controls */}
            <div className="flex items-center justify-between px-6 py-4 text-white z-10">
              <span className="font-label-caps text-xs tracking-widest uppercase opacity-70">
                {alt} — Details {active + 1}/{images.length}
              </span>
              <div className="flex items-center gap-4">
                {/* Double click/click zoom info */}
                <span className="hidden sm:inline font-body-md text-xs opacity-50">
                  {zoomScale > 1 ? "Drag to explore · Click to reset" : "Click image to zoom in further"}
                </span>
                <button
                  type="button"
                  onClick={() => setZoomScale(s => (s === 1 ? 2.5 : 1))}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Toggle zoom factor"
                >
                  <span className="material-symbols-outlined text-lg">
                    {zoomScale > 1 ? "zoom_out" : "zoom_in"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoomScale(1);
                    setIsLightboxOpen(false);
                  }}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Close details"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </div>

            {/* Lightbox main zoomable container */}
            <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
              <motion.div 
                className={cn(
                  "relative w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center",
                  zoomScale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
                )}
                onClick={() => {
                  setZoomScale(s => (s === 1 ? 2.5 : 1));
                }}
              >
                <motion.div
                  drag={zoomScale > 1}
                  dragConstraints={{ left: -400, right: 400, top: -400, bottom: 400 }}
                  dragElastic={0.15}
                  animate={{ scale: zoomScale }}
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  className="relative w-full h-full"
                >
                  <img
                    src={main}
                    alt={`${alt} detailed view`}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                </motion.div>
              </motion.div>

              {/* Prev / Next Swipe Hints on Desktop */}
              {images.length > 1 && zoomScale === 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="absolute left-6 w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="absolute right-6 w-12 h-12 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
