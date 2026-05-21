export interface ProductReview {
  id: string;
  productHandle: string;
  productTitle: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
}

export const SAMPLE_REVIEWS: ProductReview[] = [
  {
    id: "rev-entice-1",
    productHandle: "entice",
    productTitle: "Entice",
    author: "Ananya R.",
    rating: 5,
    title: "Quietly unforgettable",
    body: "Soft rose and musk that stays close to the skin. Perfect for evenings in Mumbai.",
    date: "2026-04-12",
  },
  {
    id: "rev-entice-2",
    productHandle: "entice",
    productTitle: "Entice",
    author: "Rohan K.",
    rating: 5,
    title: "My signature now",
    body: "Elegant without being loud. The bottle is as beautiful as the scent inside.",
    date: "2026-03-28",
  },
  {
    id: "rev-white-oud-1",
    productHandle: "white-oud",
    productTitle: "White Oud",
    author: "Priya M.",
    rating: 5,
    title: "Luminous oud",
    body: "Smoky woods with a white-floral lift — unlike any oud I have tried before.",
    date: "2026-04-02",
  },
  {
    id: "rev-white-oud-2",
    productHandle: "white-oud",
    productTitle: "White Oud",
    author: "Vikram S.",
    rating: 4,
    title: "Special occasion worthy",
    body: "Strong sillage; one spray is enough. Arrived beautifully packaged.",
    date: "2026-02-19",
  },
  {
    id: "rev-adore-1",
    productHandle: "adore",
    productTitle: "Adore",
    author: "Meera J.",
    rating: 5,
    title: "Morning freshness",
    body: "Citrus and green notes that feel crisp and clean. I wear it to the office daily.",
    date: "2026-04-18",
  },
  {
    id: "rev-day-dream-1",
    productHandle: "day-dream",
    productTitle: "Day Dream",
    author: "Arjun P.",
    rating: 5,
    title: "Dreamlike and warm",
    body: "Jasmine and amberwood on a creamy base — comforting yet refined.",
    date: "2026-03-05",
  },
  {
    id: "rev-day-dream-2",
    productHandle: "day-dream",
    productTitle: "Day Dream",
    author: "Sana L.",
    rating: 5,
    title: "Compliments every time",
    body: "Bought as a gift; the recipient called it their new favourite.",
    date: "2026-01-22",
  },
];

export function getReviewsForProduct(handle: string): ProductReview[] {
  return SAMPLE_REVIEWS.filter((r) => r.productHandle === handle);
}

export function getFeaturedReviews(limit = 4): ProductReview[] {
  return SAMPLE_REVIEWS.slice(0, limit);
}

export function getAverageRating(handle: string): number | null {
  const reviews = getReviewsForProduct(handle);
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
