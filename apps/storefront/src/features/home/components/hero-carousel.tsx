"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Display, Eyebrow } from "@/components/typography/display";
import type { HeroSlide } from "@/lib/homepage";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 2000;

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const active = slides[index]!;
  const hasCopy = Boolean(active.eyebrow || active.headline || active.ctaLabel);

  return (
    <div className="relative w-full overflow-hidden rounded-none md:rounded-xl">
      <div className="relative aspect-[3/4] w-full md:aspect-[21/9] md:min-h-[320px] lg:min-h-[420px]">
        {slides.map((slide, i) => (
          <div
            key={`${slide.desktopImageUrl}-${i}`}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === index ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          >
            <Image
              src={slide.mobileImageUrl}
              alt={slide.alt ?? slide.headline ?? "GALLE"}
              fill
              className="object-cover object-center md:hidden"
              priority={i === 0}
              sizes="100vw"
            />
            <Image
              src={slide.desktopImageUrl}
              alt={slide.alt ?? slide.headline ?? "GALLE"}
              fill
              className="hidden object-cover object-center md:block"
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}

        {hasCopy && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-end bg-gradient-to-t from-black/50 via-black/10 to-transparent px-6 pb-10 pt-16 text-center md:items-start md:justify-center md:pb-0 md:pl-12 md:pt-0 md:text-left">
            {active.eyebrow && (
              <Eyebrow className="mb-3 text-white/90 text-[10px] md:text-xs tracking-[0.22em]">
                {active.eyebrow}
              </Eyebrow>
            )}
            {active.headline && (
              <Display className="max-w-xl text-balance text-white text-[26px] sm:text-[32px] md:text-display-lg leading-[1.05] tracking-[-0.03em] font-normal drop-shadow-sm">
                {active.headline}
              </Display>
            )}
            {active.ctaLabel && active.linkUrl && (
              <Button
                asChild
                variant="primary"
                className="mt-6 min-w-[160px] bg-white text-primary hover:bg-white/90"
              >
                <Link href={active.linkUrl}>{active.ctaLabel}</Link>
              </Button>
            )}
          </div>
        )}

        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-1.5 md:bottom-6">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-0.5 rounded-full transition-all duration-300",
                  i === index ? "w-8 bg-white" : "w-4 bg-white/40",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
