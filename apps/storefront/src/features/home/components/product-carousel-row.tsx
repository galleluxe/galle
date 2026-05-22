"use client";

import { ProductCard } from "@/features/catalog/components/product-card";
import type { Cart, Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

interface ProductCarouselRowProps {
  products: Product[];
  cart: Cart;
  centerOnDesktop?: boolean;
}

/** Horizontal sliding row of product cards (touch-scroll + snap). */
export function ProductCarouselRow({ products, cart, centerOnDesktop = false }: ProductCarouselRowProps) {
  return (
    <div className="-mx-margin-mobile md:-mx-margin-desktop px-margin-mobile md:px-margin-desktop">
      <div className={cn(
        "flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [scrollbar-width:thin]",
        centerOnDesktop && "md:justify-center"
      )}>
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[min(85vw,280px)] shrink-0 snap-start md:w-[min(32vw,320px)]"
          >
            <ProductCard product={product} cart={cart} className="h-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
