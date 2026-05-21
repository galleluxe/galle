import Link from "next/link";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { PageShell } from "@/components/layout/page-shell";
import { Display, BodyText } from "@/components/typography/display";
import { FilterBar } from "@/features/catalog/components/filter-bar";
import { ProductCard } from "@/features/catalog/components/product-card";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import { getCart } from "@/features/cart/server/store";
import { listProducts } from "@/lib/catalog";

export const revalidate = 600;

interface ShopPageProps {
  searchParams: Promise<{ family?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { family } = await searchParams;
  const activeFamily = family?.toUpperCase();
  const [products, cart] = await Promise.all([
    listProducts(activeFamily && activeFamily !== "ALL" ? activeFamily : undefined),
    getCart(),
  ]);

  return (
    <NuqsAdapter>
      <PageShell className="pt-[40px] pb-section-gap">
        <section className="mb-section-gap text-center animate-fade-in-up">
          <Display className="mb-6">The Boutique</Display>
          <BodyText size="lg" className="max-w-2xl mx-auto">
            Discover our curated collection of ethereal essences. Each
            fragrance is meticulously crafted to evoke a distinct mood and
            memory.
          </BodyText>
        </section>

        <section className="mb-16 animate-fade-in-up [animation-delay:200ms]">
          <FilterBar />
        </section>

        <section className="animate-blur-in [animation-delay:400ms]">
          {products.length === 0 ? (
            <p className="text-center font-body-lg text-on-surface-variant py-24">
              No fragrances in this collection yet.
            </p>
          ) : (
            <ProductGrid>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} cart={cart} />
              ))}
            </ProductGrid>
          )}
        </section>

        <section className="mt-section-gap text-center">
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
