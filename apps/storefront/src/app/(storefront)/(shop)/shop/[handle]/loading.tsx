import { PageShell } from "@/components/layout/page-shell";

export default function ProductDetailLoading() {
  return (
    <PageShell className="pt-8 pb-12 md:pb-section-gap animate-pulse">
      {/* Breadcrumbs Skeleton */}
      <div className="mb-8 flex items-center gap-2 h-4 w-48 bg-surface-container rounded-md" />

      {/* Split PDP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-12 md:mb-section-gap">
        {/* Left Column: Image Carousel Skeleton */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] max-h-[600px] w-full bg-surface-container rounded-2xl" />
          {/* Thumbnail dots skeleton */}
          <div className="flex gap-2 justify-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-2 w-2 rounded-full bg-surface-container-high" />
            ))}
          </div>
        </div>

        {/* Right Column: Product Info Skeleton */}
        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            {/* Scent Family Chip Skeleton */}
            <div className="h-6 w-24 bg-surface-container rounded-full" />
            {/* Title Skeleton */}
            <div className="h-10 md:h-14 w-2/3 bg-surface-container-high rounded-lg" />
            {/* Note Line Skeleton */}
            <div className="h-5 w-1/2 bg-surface-container rounded-md" />
          </div>

          {/* Pricing & Size Selection */}
          <div className="border-y border-outline-variant/20 py-6 space-y-4">
            <div className="h-8 w-32 bg-surface-container-high rounded-md" />
            <div className="space-y-2">
              <div className="h-4 w-16 bg-surface-container rounded-md" />
              <div className="flex gap-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-10 w-20 bg-surface-container rounded-full border border-outline-variant/10" />
                ))}
              </div>
            </div>
          </div>

          {/* Description & Add to Cart */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-4 w-full bg-surface-container rounded-md" />
              <div className="h-4 w-5/6 bg-surface-container rounded-md" />
              <div className="h-4 w-4/5 bg-surface-container rounded-md" />
            </div>
            {/* Add to Cart Button Skeleton */}
            <div className="h-[52px] w-full bg-primary/20 rounded-full border-2 border-primary/20 mt-4" />
          </div>

          {/* Notes Pyramid Accordion Skeleton */}
          <div className="border border-outline-variant/30 rounded-2xl p-6 space-y-4 bg-surface-container-low mt-4">
            <div className="h-6 w-32 bg-surface-container-high rounded-md" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-surface-container rounded-md" />
              <div className="h-4 w-2/3 bg-surface-container rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
