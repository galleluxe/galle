import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { BodyText, Headline } from "@/components/typography/display";
import { HeroCarousel } from "@/features/home/components/hero-carousel";
import { PromoBannerCarousel } from "@/features/home/components/promo-banner-carousel";
import { ProductCarouselRow } from "@/features/home/components/product-carousel-row";
import { NewsletterForm } from "@/features/newsletter/components/newsletter-form";
import { HomeReviewsSection } from "@/components/reviews/product-reviews";
import { listProducts } from "@/lib/catalog";
import { getHomepageContent } from "@/lib/homepage";
import { pickComboProducts, pickProductsByIds } from "@/lib/homepage/pick-products";
import { getAllPosts } from "@/lib/journal";

export const revalidate = 600;

const FAMILIES = ["Floral", "Woody", "Fresh", "Oriental"] as const;

export default async function HomePage() {
  const [products, homepage, journalPosts] = await Promise.all([
    listProducts(),
    getHomepageContent(),
    Promise.resolve(getAllPosts().slice(0, 2)),
  ]);

  const featured = products.filter((p) => p.featured);
  const collection = products;
  const launch = pickProductsByIds(products, homepage.launchProductIds);
  const giftingFromCms = pickProductsByIds(products, homepage.giftingProductIds);
  const gifting =
    giftingFromCms.length > 0 ? giftingFromCms : pickComboProducts(products);

  return (
    <>
      {homepage.heroSlides.length > 0 && (
        <section className="w-full">
          <PromoBannerCarousel slides={homepage.heroSlides} />
        </section>
      )}

      <section className="mb-8 md:mb-section-gap">
        <PageShell>
          <HeroCarousel products={products} />
        </PageShell>
      </section>

      <section className="mb-12 md:mb-section-gap">
        <PageShell>
          <div className="text-center mb-12">
            <Headline size="sm">Discover Our Iconics &amp; Best Sellers</Headline>
            <BodyText className="mt-4 max-w-xl mx-auto">
              Curated signatures from the maison. Mark products as Featured in the admin to add them here.
            </BodyText>
          </div>
          <ProductCarouselRow products={featured} centerOnDesktop />
        </PageShell>
      </section>

      <section className="mb-12 md:mb-section-gap">
        <PageShell>
          <div className="text-center mb-12">
            <Headline size="sm">{homepage.launchSectionTitle}</Headline>
            <BodyText className="mt-4 max-w-xl mx-auto">
              The latest expressions from the atelier. Choose up to five products under Globals → Homepage → New Launch.
            </BodyText>
          </div>
          <ProductCarouselRow products={launch} intervalMs={3000} centerOnDesktop />
        </PageShell>
      </section>

      <section className="mb-12 md:mb-section-gap">
        <PageShell>
          <div className="text-center mb-12">
            <Headline size="sm">The Collection</Headline>
          </div>
          <ProductCarouselRow products={collection} />
          <div className="text-center mt-12">
            <Button asChild variant="ghost">
              <Link href="/shop">View All</Link>
            </Button>
          </div>
        </PageShell>
      </section>

      <section className="mb-12 md:mb-section-gap">
        <PageShell>
          <div className="text-center mb-12">
            <Headline size="sm">{homepage.giftingSectionTitle}</Headline>
            {homepage.giftingSectionSubtitle ? (
              <BodyText className="mt-4 max-w-xl mx-auto">
                {homepage.giftingSectionSubtitle}
              </BodyText>
            ) : (
              <BodyText className="mt-4 max-w-xl mx-auto">
                Thoughtful pairings and gift sets for someone special.
              </BodyText>
            )}
          </div>
          <ProductCarouselRow products={gifting} intervalMs={1500} />
          <div className="text-center mt-12 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="primary">
              <Link href="/gifting">Send a Gift</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/shop">Shop Combos</Link>
            </Button>
          </div>
        </PageShell>
      </section>

      <section className="mb-12 md:mb-section-gap border-y border-outline-variant/30 py-10 md:py-16 overflow-hidden">
        <PageShell>
          <div className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth hide-scrollbar md:grid md:grid-cols-5 md:pb-0">
            {[
              {
                icon: (
                  <svg className="w-12 h-12 text-secondary mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707.707M12 5a7 7 0 00-7 7 3 3 0 003 3h8a3 3 0 003-3 7 7 0 00-7-7z" />
                  </svg>
                ),
                title: "Natural Ingredients",
                desc: "Only the purest, safest botanicals.",
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-secondary mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "IFRA Certified",
                desc: "International Fragrance Association Certified",
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-secondary mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "Cruelty-Free",
                desc: "Never tested on animals.",
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-secondary mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                ),
                title: "Non-Carcinogenic",
                desc: "No harmful chemicals or toxins.",
              },
              {
                icon: (
                  <svg className="w-12 h-12 text-secondary mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Paraben-Free",
                desc: "Gentle and safe for all skin types.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="w-[240px] shrink-0 snap-center bg-[#FCFBF9] border border-outline-variant/20 p-6 md:p-8 text-center md:w-auto"
              >
                {item.icon}
                <p className="font-headline-sm text-sm text-primary mb-2 uppercase tracking-widest font-semibold">
                  {item.title}
                </p>
                <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </PageShell>
      </section>

      <section className="mb-12 md:mb-section-gap">
        <PageShell>
          <div className="text-center mb-12">
            <Headline>Scent Discovery</Headline>
            <BodyText className="mt-4 max-w-xl mx-auto">
              Explore by olfactory family, or take our{" "}
              <Link href="/scent-quiz" className="text-secondary hover:underline">
                scent quiz
              </Link>{" "}
              to find your essence.
            </BodyText>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FAMILIES.map((family) => (
              <Link
                key={family}
                href={`/shop?family=${family}`}
                className="group p-8 bg-primary-container/20 rounded-xl text-center hover:bg-primary-container/40 transition-colors ambient-shadow"
              >
                <span className="material-symbols-outlined text-3xl text-primary mb-4 block">
                  fragrance
                </span>
                <p className="font-label-caps text-label-caps text-primary uppercase tracking-widest">
                  {family}
                </p>
              </Link>
            ))}
          </div>
        </PageShell>
      </section>

      <section className="mb-12 md:mb-section-gap">
        <PageShell>
          <div className="text-center mb-12">
            <Headline>From the Journal</Headline>
            <BodyText className="mt-4 max-w-xl mx-auto">
              Stories of craft, scent, and the art of perfumery.
            </BodyText>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter max-w-4xl mx-auto">
            {journalPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/journal/${post.slug}`}
                className="group p-8 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors ambient-shadow"
              >
                <div className="flex gap-3 items-center mb-3">
                  <span className="font-label-caps text-[10px] uppercase tracking-widest text-secondary">{post.category}</span>
                  <span className="text-outline-variant/60">·</span>
                  <span className="font-label-caps text-[10px] uppercase tracking-widest text-outline">
                    {new Date(post.date).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                  </span>
                </div>
                <p className="font-headline-sm text-headline-sm text-primary mb-2 group-hover:text-secondary transition-colors">
                  {post.title}
                </p>
                <BodyText>{post.excerpt}</BodyText>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="ghost">
              <Link href="/journal">Read All</Link>
            </Button>
          </div>
        </PageShell>
      </section>

      <section className="mb-12 md:mb-section-gap">
        <PageShell>
          <HomeReviewsSection />
        </PageShell>
      </section>

      <section className="mb-12 md:mb-section-gap bg-primary-container/10 py-12 md:py-16">
        <PageShell narrow className="text-center">
          <Headline className="mb-4">Stay in the Atelier</Headline>
          <BodyText className="mb-8">
            Receive exclusive launches and scent stories.
          </BodyText>
          <NewsletterForm />
        </PageShell>
      </section>
    </>
  );
}
