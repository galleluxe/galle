import Link from "next/link";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Display, BodyText } from "@/components/typography/display";
import { ShopFilterableGrid } from "@/features/catalog/components/shop-filterable-grid";
import { listProducts } from "@/lib/catalog";

export const revalidate = 600;

export default async function ShopPage() {
  const products = await listProducts();

  return (
    <NuqsAdapter>
      <PageShell className="pt-4 md:pt-[40px] pb-12 md:pb-section-gap">
        <section className="mb-12 md:mb-section-gap text-center animate-fade-in-up">
          <Display className="mb-6">The Boutique</Display>
          <BodyText size="lg" className="max-w-2xl mx-auto">
            Discover our curated collection of ethereal essences. Each
            fragrance is meticulously crafted to evoke a distinct mood and
            memory.
          </BodyText>
        </section>

        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <span className="material-symbols-outlined text-3xl text-primary animate-spin">
              progress_activity
            </span>
          </div>
        }>
          <ShopFilterableGrid products={products} />
        </Suspense>

        <section className="mt-16 md:mt-section-gap text-center">
          <BodyText className="mb-4">Looking for the perfect gift?</BodyText>
          <Link
            href="/gifting"
            className="font-label-caps text-label-caps text-secondary uppercase tracking-widest hover:underline"
          >
            Explore Gifting →
          </Link>
        </section>
      </PageShell>
    </NuqsAdapter>
  );
}
