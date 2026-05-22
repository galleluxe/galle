import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { Chip } from "@/components/ui/chip";
import { Display, BodyText, Headline, Eyebrow } from "@/components/typography/display";
import { NotePyramid } from "@/components/media/note-pyramid";
import { ProductGallery } from "@/components/media/product-gallery";
import { ProductCard } from "@/features/catalog/components/product-card";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { BuyNowButton } from "@/features/cart/components/buy-now-button";
import { Reveal } from "@/components/motion/reveal";
import { getProduct, listProducts } from "@/lib/catalog";
import { formatINR } from "@/lib/money";
import { ProductReviews } from "@/components/reviews/product-reviews";
import { buildProductMetadata, buildProductJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";

interface PDPProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: PDPProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product" };
  return buildProductMetadata(product);
}

export const revalidate = 600;

export default async function ProductPage({ params }: PDPProps) {
  const { handle } = await params;
  const [product, allProducts] = await Promise.all([
    getProduct(handle),
    listProducts(),
  ]);

  if (!product) notFound();

  const variant = product.variants[0];
  const related = allProducts.filter((p) => p.handle !== handle).slice(0, 3);
  const fragrance = product.fragrance;
  const productJsonLd = buildProductJsonLd(product);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "https://galle.com" },
    { name: "Boutique", url: "https://galle.com/shop" },
    { name: product.title, url: `https://galle.com/shop/${product.handle}` },
  ]);

  return (
    <PageShell className="pt-8 pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-primary">Boutique</Link>
        <span>/</span>
        <span className="text-primary">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-12 md:mb-16">
        <Reveal>
          <ProductGallery
            images={product.images.length > 0 ? product.images : [product.thumbnail]}
            alt={product.title}
          />
        </Reveal>
        <div className="flex flex-col justify-center">
          {fragrance && (
            <div className="flex gap-2 mb-4 flex-wrap">
              <Chip>{fragrance.family}</Chip>
              {product.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          )}
          <Display className="text-display-lg-mobile md:text-display-lg mb-4">
            {product.title}
          </Display>
          <BodyText size="lg" className="mb-6">
            {product.description}
          </BodyText>
          {variant && (
            <>
              <p className="font-headline-md text-headline-md text-on-surface mb-8">
                {formatINR(variant.pricePaise)}
              </p>
              <div className="flex gap-4 flex-wrap">
                <AddToCartButton
                  variantId={variant.id}
                  productHandle={product.handle}
                />
                <BuyNowButton
                  variantId={variant.id}
                  productHandle={product.handle}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {fragrance && (
        <Reveal>
          <NotePyramid
            fragrance={fragrance}
            className="mb-12 md:mb-16 py-12 border-t border-outline-variant/30"
          />
        </Reveal>
      )}

      {related.length > 0 && (
        <section>
          <Headline className="mb-8 text-center">You May Also Love</Headline>
          <ProductGrid>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </ProductGrid>
        </section>
      )}
            <ProductReviews productHandle={product.handle} productTitle={product.title} />

    </PageShell>
  );
}
