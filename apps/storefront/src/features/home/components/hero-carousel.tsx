"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BodyText, Display, Eyebrow } from "@/components/typography/display";
import { resolveProductImageUrl } from "@/lib/catalog/resolve-image";
import type { Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 5000;

interface HeroCarouselProps {
  products: Product[];
}

function HeroImageStack({
  slides,
  index,
  className,
}: {
  slides: Product[];
  index: number;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-surface-container-low", className)}>
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === index ? "opacity-100 z-10" : "opacity-0 z-0",
          )}
        >
          <Image
            src={resolveProductImageUrl(slide.thumbnail)}
            alt={slide.title}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}
    </div>
  );
}

export function HeroCarousel({ products }: HeroCarouselProps) {
  const slides = products.filter((p) => p.variants.length > 0);
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
  const tagline = active.noteLine ?? active.description;

  return (
    <div className="w-full">
      {/* Mobile: image sits directly under navbar — no extra vertical padding */}
      <HeroImageStack
        slides={slides}
        index={index}
        className="relative aspect-[3/4] max-h-[min(72vh,520px)] w-full md:hidden"
      />

      <div className="px-margin-mobile md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-gutter md:items-center pt-5 pb-8 md:py-section-gap">
          <div className="text-center md:text-left space-y-3 md:space-y-6 order-2 md:order-1">
            <Eyebrow className="text-[10px] tracking-[0.2em] md:text-label-caps">
              {active.subtitle ?? "The New Signature"}
            </Eyebrow>
            <Display className="text-display-md-mobile md:text-display-lg text-balance leading-tight">
              {active.title}
            </Display>
            <BodyText
              size="lg"
              className="max-w-md mx-auto md:mx-0 line-clamp-3 md:line-clamp-none text-body-md md:text-body-lg"
            >
              {tagline}
            </BodyText>
            <div className="flex flex-col gap-3 pt-2 justify-center md:justify-start md:flex-row md:gap-4">
              <Button asChild variant="primary" className="w-full md:w-auto md:min-w-[200px]">
                <Link href={`/shop/${active.handle}`}>
                  Explore {active.title}
                </Link>
              </Button>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link href="/shop">View Collection</Link>
              </Button>
            </div>
            {slides.length > 1 && (
              <div className="flex justify-center md:justify-start gap-2 pt-1">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Show ${slide.title}`}
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === index ? "w-8 bg-primary" : "w-3 bg-outline-variant/50",
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          <HeroImageStack
            slides={slides}
            index={index}
            className="relative hidden md:block aspect-[4/5] max-h-[520px] w-full max-w-md mx-auto rounded-xl ambient-shadow order-1 md:order-2"
          />
        </div>
      </div>
    </div>
  );
}
