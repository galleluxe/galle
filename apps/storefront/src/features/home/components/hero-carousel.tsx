"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BodyText, Display, Eyebrow } from "@/components/typography/display";
import { resolveProductImageUrl } from "@/lib/catalog/resolve-image";
import type { Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 3000;

interface HeroCarouselProps {
  products: Product[];
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center py-12 md:py-section-gap">
      <div className="text-center md:text-left space-y-8 order-2 md:order-1">
        <Eyebrow>The New Signature</Eyebrow>
        <Display className="text-balance">Whispers of Grace</Display>
        <BodyText size="lg" className="max-w-md mx-auto md:mx-0 min-h-[4.5rem] transition-opacity duration-500">
          {active.description}
        </BodyText>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Button asChild variant="primary" className="min-w-[200px]">
            <Link href={`/shop/${active.handle}`}>
              Explore {active.title}
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/shop">View Collection</Link>
          </Button>
        </div>
        {slides.length > 1 && (
          <div className="flex justify-center md:justify-start gap-2 pt-2">
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

      <div className="relative aspect-[4/5] max-h-[520px] mx-auto w-full max-w-md order-1 md:order-2">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 ambient-shadow rounded-xl overflow-hidden bg-surface-container-low transition-opacity duration-700",
              i === index ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          >
            <Image
              src={resolveProductImageUrl(slide.thumbnail)}
              alt={slide.title}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
