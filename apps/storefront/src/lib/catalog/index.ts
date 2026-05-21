import { resolveProductImageUrl } from "@/lib/catalog/resolve-image";
import { isMedusaConfigured } from "@/lib/medusa/client";
import type { Product, ScentFamily, FragranceProfile } from "./types";

/** Medusa calculated_price amounts are in major units (rupees for INR). */
function variantPricePaise(variant: Record<string, any>): number {
  const calculated = variant?.calculated_price as Record<string, any> | undefined;
  const amount = Number(
    calculated?.calculated_amount ?? calculated?.original_amount ?? 0
  );
  if (!amount) return 0;
  return Math.round(amount * 100);
}

function mapMedusaProduct(raw: Record<string, any>): Product | null {
  const handle = raw.handle as string | undefined;
  if (!handle) return null;
  const variants = (raw.variants as Array<Record<string, any>>) ?? [];
  if (variants.length === 0) return null;

  const fp = raw.fragrance_profile as Record<string, any> | undefined;
  let fragrance: FragranceProfile | undefined = undefined;
  if (fp) {
    fragrance = {
      family: fp.family as ScentFamily,
      topNotes: Array.isArray(fp.top_notes) ? fp.top_notes : [],
      heartNotes: Array.isArray(fp.heart_notes) ? fp.heart_notes : [],
      baseNotes: Array.isArray(fp.base_notes) ? fp.base_notes : [],
      longevityHours: fp.longevity_hours ? Number(fp.longevity_hours) : undefined,
      sillage: fp.sillage as FragranceProfile["sillage"],
      occasion: Array.isArray(fp.occasion) ? fp.occasion : [],
      editorialPullquote: fp.editorial_pullquote
        ? String(fp.editorial_pullquote)
        : undefined,
    };
  }

  let noteLine = raw.noteLine as string | undefined;
  if (!noteLine && fragrance) {
    const notes = [
      fragrance.topNotes[0],
      fragrance.heartNotes[0],
      fragrance.baseNotes[0],
    ].filter(Boolean);
    noteLine = notes.join(" · ");
  }

  const rawThumb =
    (raw.thumbnail as string) ??
    ((raw.images as Array<{ url: string }>)?.[0]?.url);

  return {
    id: String(raw.id),
    handle,
    title: String(raw.title ?? handle),
    description: String(raw.description ?? ""),
    noteLine,
    thumbnail: rawThumb ? resolveProductImageUrl(String(rawThumb)) : "",
    images: ((raw.images as Array<{ url: string }>) ?? [])
      .map((i) => resolveProductImageUrl(i.url))
      .filter(Boolean),
    tags: [],
    variants: variants.map((v) => ({
      id: String(v.id),
      title: String(v.title ?? "Default"),
      sku: String(v.sku ?? ""),
      pricePaise: variantPricePaise(v),
      inventory: Number(v.inventory_quantity ?? v.inventory ?? 0),
    })),
    fragrance,
  };
}

async function fetchMedusaProducts(): Promise<Product[]> {
  if (!isMedusaConfigured()) {
    console.error(
      "[catalog] Medusa is not configured. Set NEXT_PUBLIC_MEDUSA_URL and NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY."
    );
    return [];
  }

  const baseUrl =
    process.env.MEDUSA_BACKEND_URL ?? process.env.NEXT_PUBLIC_MEDUSA_URL;
  const res = await fetch(`${baseUrl}/store/products-with-fragrance`, {
    headers: {
      "x-publishable-api-key":
        process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
    },
    next: { revalidate: 60, tags: ["shop", "medusa-catalog"] },
  });

  if (!res.ok) {
    console.error(
      `[catalog] Medusa products fetch failed: ${res.status} ${res.statusText}`
    );
    return [];
  }

  const { products } = await res.json();
  return (products as Record<string, unknown>[])
    .map((p) => mapMedusaProduct(p as Record<string, any>))
    .filter((p): p is Product => p !== null);
}

export async function listProducts(family?: string): Promise<Product[]> {
  try {
    const mapped = await fetchMedusaProducts();
    if (!family || family === "ALL") return mapped;
    return mapped.filter(
      (p) => p.fragrance?.family.toUpperCase() === family.toUpperCase()
    );
  } catch (error) {
    console.error("[catalog] listProducts error:", error);
    return [];
  }
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const products = await listProducts();
  return products.find((p) => p.handle === handle);
}
