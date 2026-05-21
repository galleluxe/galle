import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { BodyText, Headline } from "@/components/typography/display";
import { HomeReviewsSection } from "@/components/reviews/product-reviews";
import { getCart } from "@/features/cart/server/store";
import { HeroCarousel } from "@/features/home/components/hero-carousel";
import { ProductCarouselRow } from "@/features/home/components/product-carousel-row";
import { NewsletterForm } from "@/features/newsletter/components/newsletter-form";
import { listProducts } from "@/lib/catalog";
import { getAllPosts } from "@/lib/journal";

export const revalidate = 600;

const FAMILIES = ["Floral", "Woody", "Fresh", "Oriental"] as const;

export default async function HomePage() {
  const [products, cart] = await Promise.all([listProducts(), getCart()]);
  const journalPosts = getAllPosts().slice(0, 2);
  const collection = products.slice(0, 5);
  const featuredFlagged = products.filter((p) => p.featured);
  const featured =
    featuredFlagged.length > 0 ? featuredFlagged : products.slice(0, 4);

  return (
    <>
      <section className="mb-section-gap">
        <HeroCarousel products={products} />
      </section>

      <section className="mb-section-gap border-y border-outline-variant/30 py-16">
        <PageShell>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: "eco", title: "Sustainable", desc: "Ethically sourced botanicals" },
              { icon: "verified", title: "Authentic", desc: "Crafted in small batches" },
              { icon: "local_shipping", title: "India-wide", desc: "Pan-India delivery" },
            ].map((item) => (
              <div key={item.title}>
                <span className="material-symbols-outlined text-3xl text-secondary mb-4 block">
                  {item.icon}
                </span>
                <p className="font-headline-sm text-headline-sm text-primary mb-2">
                  {item.title}
                </p>
                <BodyText>{item.desc}</BodyText>
              </div>
            ))}
          </div>
        </PageShell>
      </section>
      
      <section className="mb-section-gap">
        <PageShell>
          <div className="text-center mb-8 md:mb-12">
            <Headline size="sm">Featured</Headline>
            <BodyText className="mt-3 md:mt-4 max-w-xl mx-auto">
              Curated signatures from the maison.
            </BodyText>
          </div>
          <ProductCarouselRow products={featured} cart={cart} />
        </PageShell>
      </section>

      <section className="mb-section-gap">
        <PageShell>
          <div className="text-center mb-12">
            <Headline size="sm">The Collection</Headline>
          </div>
          <ProductCarouselRow products={collection} cart={cart} />
          <div className="text-center mt-12">
            <Button asChild variant="ghost">
              <Link href="/shop">View All</Link>
            </Button>
          </div>
        </PageShell>
      </section>

      <section className="mb-section-gap">
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



      <section className="mb-section-gap">
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

      <section className="mb-section-gap">
        <PageShell>
          <HomeReviewsSection />
        </PageShell>
      </section>

      <section className="mb-section-gap bg-primary-container/10 py-16">
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
