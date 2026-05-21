import Link from "next/link";
import { Headline, BodyText, Eyebrow } from "@/components/typography/display";
import {
  getAverageRating,
  getFeaturedReviews,
  getReviewsForProduct,
  type ProductReview,
} from "@/lib/reviews/sample-reviews";
import { cn } from "@/lib/utils";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-secondary" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "material-symbols-outlined text-base leading-none",
            i < rating ? "icon-fill" : "opacity-30",
          )}
          style={i < rating ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          star
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ProductReview }) {
  return (
    <article className="rounded-xl border border-outline-variant/25 bg-surface-container-lowest p-6 ambient-shadow">
      <Stars rating={review.rating} />
      <p className="font-headline-sm text-headline-sm text-primary mt-3 mb-2">
        {review.title}
      </p>
      <BodyText className="mb-4">{review.body}</BodyText>
      <p className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant">
        {review.author} ·{" "}
        {new Date(review.date).toLocaleDateString("en-IN", {
          month: "short",
          year: "numeric",
        })}
      </p>
    </article>
  );
}

interface ProductReviewsProps {
  productHandle: string;
  productTitle: string;
  showProductLink?: boolean;
}

export function ProductReviews({
  productHandle,
  productTitle,
  showProductLink = false,
}: ProductReviewsProps) {
  const reviews = getReviewsForProduct(productHandle);
  if (reviews.length === 0) return null;

  const average = getAverageRating(productHandle);

  return (
    <section className="mb-section-gap py-12 border-t border-outline-variant/30">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <Eyebrow className="mb-2">Maison Voices</Eyebrow>
          <Headline size="sm">Reviews</Headline>
          {average !== null && (
            <div className="mt-2 font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
              <Stars rating={Math.round(average)} />
              <span>{average} · {reviews.length} reviews</span>
            </div>
          )}
        </div>
        {showProductLink && (
          <Link
            href={`/shop/${productHandle}`}
            className="font-label-caps text-[10px] uppercase tracking-widest text-secondary hover:underline"
          >
            {productTitle}
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
}

export function HomeReviewsSection() {
  const reviews = getFeaturedReviews(4);

  return (
    <section className="mb-section-gap">
      <div className="text-center mb-12">
        <Eyebrow className="mb-2">Maison Voices</Eyebrow>
        <Headline size="sm">What Our Patrons Say</Headline>
        <BodyText className="mt-4 max-w-xl mx-auto">
          Words from patrons who wear the maison.
        </BodyText>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter max-w-5xl mx-auto">
        {reviews.map((review) => (
          <div key={review.id}>
            <ReviewCard review={review} />
            <Link
              href={`/shop/${review.productHandle}`}
              className="inline-block mt-3 font-label-caps text-[10px] uppercase tracking-widest text-secondary hover:underline"
            >
              {review.productTitle} →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
