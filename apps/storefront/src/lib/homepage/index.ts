import { unstable_cache } from "next/cache";
import { resolveProductImageUrl } from "@/lib/catalog/resolve-image";
import { getPayloadClient } from "@/lib/payload";

export interface HeroSlide {
  desktopImageUrl: string;
  mobileImageUrl: string;
  alt?: string;
  eyebrow?: string;
  headline?: string;
  ctaLabel?: string;
  linkUrl?: string;
}

async function fetchHomeHeroSlides(): Promise<HeroSlide[]> {
  const payload = await getPayloadClient();
  const global = await payload.findGlobal({
    slug: "homepage",
    depth: 0,
  });

  const raw = (global.heroSlides ?? []) as Array<{
    desktopImageUrl?: string;
    mobileImageUrl?: string;
    alt?: string | null;
    eyebrow?: string | null;
    headline?: string | null;
    ctaLabel?: string | null;
    linkUrl?: string | null;
  }>;

  return raw
    .filter((s) => s.desktopImageUrl && s.mobileImageUrl)
    .map((s) => ({
      desktopImageUrl: resolveProductImageUrl(s.desktopImageUrl),
      mobileImageUrl: resolveProductImageUrl(s.mobileImageUrl),
      alt: s.alt ?? undefined,
      eyebrow: s.eyebrow ?? undefined,
      headline: s.headline ?? undefined,
      ctaLabel: s.ctaLabel ?? undefined,
      linkUrl: s.linkUrl ?? undefined,
    }));
}

export const getCachedHomeHeroSlides = unstable_cache(
  fetchHomeHeroSlides,
  ["homepage-hero-slides"],
  { tags: ["homepage", "shop"], revalidate: 3600 },
);

export async function getHomeHeroSlides(): Promise<HeroSlide[]> {
  try {
    return await getCachedHomeHeroSlides();
  } catch (error) {
    console.error("[homepage] getHomeHeroSlides error:", error);
    return [];
  }
}
