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

export interface HomepageContent {
  heroSlides: HeroSlide[];
  launchSectionTitle: string;
  launchProductIds: string[];
  giftingSectionTitle: string;
  giftingSectionSubtitle?: string;
  giftingProductIds: string[];
}

function relId(entry: unknown): string | null {
  if (entry == null) return null;
  if (typeof entry === "object" && entry !== null && "id" in entry) {
    return String((entry as { id: unknown }).id);
  }
  return String(entry);
}

async function fetchHomepageContent(): Promise<HomepageContent> {
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

  const heroSlides = raw
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

  const launchRaw = (global as { launchProducts?: unknown }).launchProducts;
  const giftingRaw = (global as { giftingProducts?: unknown }).giftingProducts;

  const launchProductIds = (Array.isArray(launchRaw) ? launchRaw : [])
    .map(relId)
    .filter((id): id is string => Boolean(id));

  const giftingProductIds = (Array.isArray(giftingRaw) ? giftingRaw : [])
    .map(relId)
    .filter((id): id is string => Boolean(id));

  return {
    heroSlides,
    launchSectionTitle:
      String((global as { launchSectionTitle?: string }).launchSectionTitle ?? "") ||
      "New Launch",
    launchProductIds,
    giftingSectionTitle:
      String((global as { giftingSectionTitle?: string }).giftingSectionTitle ?? "") ||
      "Gifting",
    giftingSectionSubtitle:
      (global as { giftingSectionSubtitle?: string | null }).giftingSectionSubtitle ??
      undefined,
    giftingProductIds,
  };
}

export const getCachedHomepageContent = unstable_cache(
  fetchHomepageContent,
  ["homepage-content-v2"],
  { tags: ["homepage", "shop"], revalidate: 3600 },
);

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    return await getCachedHomepageContent();
  } catch (error) {
    console.error("[homepage] getHomepageContent error:", error);
    return {
      heroSlides: [],
      launchSectionTitle: "New Launch",
      launchProductIds: [],
      giftingSectionTitle: "Gifting",
      giftingProductIds: [],
    };
  }
}

/** @deprecated Use getHomepageContent().heroSlides */
export async function getHomeHeroSlides(): Promise<HeroSlide[]> {
  const content = await getHomepageContent();
  return content.heroSlides;
}
