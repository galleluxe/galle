import { PageShell } from "@/components/layout/page-shell";
import { ProductGrid } from "@/features/catalog/components/product-grid";

export default function ShopLoading() {
  const skeletonCards = Array.from({ length: 6 });
  const families = ["ALL", "Floral", "Woody", "Fresh", "Oriental"];

  return (
    <PageShell className="pt-4 md:pt-[40px] pb-12 md:pb-section-gap animate-pulse">
      {/* Title Header */}
      <section className="mb-12 md:mb-section-gap text-center">
        <div className="h-12 w-48 bg-surface-container-high rounded-lg mx-auto mb-4" />
        <div className="h-5 w-72 bg-surface-container-low rounded-md mx-auto" />
      </section>

      {/* Scent Family Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {families.map((f, i) => (
          <div
            key={i}
            className="px-6 py-2 rounded-full h-9 bg-surface-container-low border border-outline-variant/20 w-24"
          />
        ))}
      </div>

      {/* Products Grid */}
      <ProductGrid>
        {skeletonCards.map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-lg bg-surface-container-lowest border border-outline-variant/10 shadow-[0_4px_24px_rgba(111,89,89,0.03)]"
          >
            {/* Image Container Skeleton */}
            <div className="relative aspect-[5/6] bg-surface-container" />

            {/* Details Skeleton */}
            <div className="flex flex-col gap-4 p-5 md:p-6">
              <div className="h-6 w-1/2 bg-surface-container-high rounded-md" />

              <div className="flex items-baseline justify-between gap-3">
                <div className="h-4 w-2/3 bg-surface-container rounded-md" />
                <div className="h-5 w-16 bg-surface-container-high rounded-md" />
              </div>

              {/* Add to Cart button skeleton */}
              <div className="h-[44px] w-full bg-surface-container rounded-md mt-1" />
            </div>
          </div>
        ))}
      </ProductGrid>
    </PageShell>
  );
}
