import Link from "next/link";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { PageShell } from "@/components/layout/page-shell";
import { Display, BodyText, Eyebrow } from "@/components/typography/display";
import { FilterBar } from "@/features/catalog/components/filter-bar";
import { ProductCard } from "@/features/catalog/components/product-card";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import { ProductCarouselRow } from "@/features/home/components/product-carousel-row";
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
      <PageShell className="pt-2 md:pt-6 pb-section-gap">
        <section className="mb-8 md:mb-section-gap text-center">
          <Eyebrow className="mb-3">Maison GALLE</Eyebrow>
          <Display className="text-display-md-mobile md:text-display-lg mb-4 md:mb-6">
            The Boutique
          </Display>
          <BodyText
            size="lg"
            className="max-w-2xl mx-auto text-body-md md:text-body-lg line-clamp-4 md:line-clamp-none"
          >
            Discover our curated collection of ethereal essences. Each fragrance
            is meticulously crafted to evoke a distinct mood and memory.
          </BodyText>
        </section>

        <section className="mb-10 md:mb-16">
          <FilterBar />
        </section>

        <section>
          {products.length === 0 ? (
            <p className="text-center font-body-lg text-on-surface-variant py-24">
              No fragrances in this collection yet.
            </p>
          ) : (
            <>
              <div className="md:hidden">
                <ProductCarouselRow products={products} cart={cart} />
              </div>
              <div className="hidden md:block">
                <ProductGrid>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} cart={cart} />
                  ))}
                </ProductGrid>
              </div>
            </>
          )}
        </section>

        <section className="mt-12 md:mt-section-gap text-center">
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
