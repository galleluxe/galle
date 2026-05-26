"use client";

import { useEffect, useRef } from "react";
import { ProductCard } from "@/features/catalog/components/product-card";
import type { Cart, Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 1500;

interface ProductCarouselRowProps {
  products: Product[];
  cart?: Cart;
  centerOnDesktop?: boolean;
}

/** Horizontal row of product cards that auto-scrolls every 1.5s (all cards stay in the track). */
export function ProductCarouselRow({
  products,
  cart,
  centerOnDesktop = false,
}: ProductCarouselRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || products.length <= 1) return;

    const id = window.setInterval(() => {
      const firstCard = el.querySelector<HTMLElement>("[data-carousel-card]");
      const gap = 24;
      const step = (firstCard?.offsetWidth ?? 280) + gap;
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (maxScroll <= 0) return;

      if (el.scrollLeft >= maxScroll - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [products.length]);

  if (products.length === 0) {
    return (
      <p className="text-center text-on-surface-variant text-sm">
        No fragrances to show yet.
      </p>
    );
  }

  return (
    <div className="-mx-margin-mobile md:-mx-margin-desktop px-margin-mobile md:px-margin-desktop">
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth hide-scrollbar",
          centerOnDesktop && "md:justify-center",
        )}
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-carousel-card
            className="w-[min(85vw,280px)] shrink-0 snap-start md:w-[min(32vw,320px)]"
          >
            <ProductCard product={product} cart={cart} className="h-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
