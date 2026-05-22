"use client";

import { useQueryState } from "nuqs";
import { FilterBar } from "./filter-bar";
import { ProductCard } from "./product-card";
import { ProductGrid } from "./product-grid";
import type { Product } from "@/lib/catalog/types";

interface ShopFilterableGridProps {
  products: Product[];
}

export function ShopFilterableGrid({ products }: ShopFilterableGridProps) {
  const [family] = useQueryState("family", {
    defaultValue: "ALL",
  });

  const activeFamily = family?.toUpperCase() ?? "ALL";

  const filteredProducts = products.filter((product) => {
    if (activeFamily === "ALL") return true;
    return product.fragrance?.family.toUpperCase() === activeFamily;
  });

  return (
    <div className="space-y-12">
      <section className="mb-16 animate-fade-in-up [animation-delay:200ms]">
        <FilterBar />
      </section>

      <section className="animate-blur-in [animation-delay:400ms]">
        {filteredProducts.length === 0 ? (
          <p className="text-center font-body-lg text-on-surface-variant py-24">
            No fragrances in this collection yet.
          </p>
        ) : (
          <ProductGrid>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        )}
      </section>
    </div>
  );
}
