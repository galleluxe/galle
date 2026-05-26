"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/features/catalog/components/product-card";
import type { Cart, Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 1500;

interface ProductCarouselRowProps {
  products: Product[];
  cart?: Cart;
}

/** Auto-advancing carousel — one perfume visible at a time, advances every 1.5s. */
export function ProductCarouselRow({ products, cart }: ProductCarouselRowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % products.length);
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
    <div className="mx-auto w-full max-w-sm md:max-w-md">
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {products.map((product) => (
            <div key={product.id} className="w-full shrink-0">
              <ProductCard product={product} cart={cart} className="h-full" />
            </div>
          ))}
        </div>
      </div>

      {products.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-6">
          {products.map((product, i) => (
            <button
              key={product.id}
              type="button"
              aria-label={`Show ${product.title}`}
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
  );
}
