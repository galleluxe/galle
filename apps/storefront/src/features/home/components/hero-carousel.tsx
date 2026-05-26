"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BodyText, Display, Eyebrow } from "@/components/typography/display";
import { resolveProductImageUrl } from "@/lib/catalog/resolve-image";
import type { Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 1500; // Reduced to 1.5s for faster luxury transition pacing

interface HeroCarouselProps {
  products: Product[];
}

export function HeroCarousel({ products }: HeroCarouselProps) {
  const slides = products.filter((p) => p.variants.length > 0);
  const [index, setIndex] = useState(0);

  // Touch Swipe Gesture State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50; // pixels

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const active = slides[index]!;

  const handleTouchStart = (e: React.TouchEvent) => {
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
      // Swipe Left -> Next Slide
      setIndex((i) => (i + 1) % slides.length);
    } else if (isRightSwipe) {
      // Swipe Right -> Prev Slide
      setIndex((i) => (i - 1 + slides.length) % slides.length);
    }
  };

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-gutter items-center pt-2 pb-8 md:py-section-gap select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="text-center md:text-left space-y-6 md:space-y-8 order-2 md:order-1">
        <Eyebrow className="text-primary text-[10px] md:text-xs tracking-[0.22em] font-medium">
          The New Signature
        </Eyebrow>
        <Display className="text-balance text-[28px] sm:text-[36px] md:text-display-lg leading-[1.05] tracking-[-0.03em] text-primary font-normal">
          Whispers of Grace
        </Display>
        <BodyText
          size="lg"
          className="max-w-md mx-auto md:mx-0 text-sm md:text-base min-h-[3.5rem] md:min-h-[4.5rem] transition-opacity duration-500 text-on-surface-variant/90 leading-relaxed font-normal"
        >
          {active.description}
        </BodyText>
        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
          <Button asChild variant="primary" className="min-w-[180px] md:min-w-[200px] text-xs py-2.5 md:py-3.5">
            <Link href={`/shop/${active.handle}`}>
              Explore {active.title}
            </Link>
          </Button>
          <Button asChild variant="ghost" className="text-xs py-2.5 md:py-3.5">
            <Link href="/shop">View Collection</Link>
          </Button>
        </div>
        {slides.length > 1 && (
          <div className="flex justify-center md:justify-start gap-1.5 pt-1">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show ${slide.title}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i === index ? "w-6 bg-primary" : "w-2 bg-outline-variant/50",
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="relative aspect-[4/5] max-h-[380px] md:max-h-[520px] mx-auto w-full max-w-sm md:max-w-md order-1 md:order-2 cursor-grab active:cursor-grabbing">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 ambient-shadow rounded-xl overflow-hidden bg-surface-container-low transition-opacity duration-700 pointer-events-none",
              i === index ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          >
            <Image
              src={resolveProductImageUrl(slide.thumbnail)}
              alt={slide.title}
              fill
              className="object-cover select-none pointer-events-none"
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
