import { unstable_cache } from "next/cache";
import { resolveProductImageUrl } from "@/lib/catalog/resolve-image";
import { getPayloadClient } from "@/lib/payload";
import { mapPayloadToProduct } from "@/lib/checkout/resolve-cart";
import type { Product } from "./types";

async function fetchPublishedProducts(): Promise<Product[]> {
  const payload = await getPayloadClient();

  // 1. Fetch all published products
  const { docs: products } = await payload.find({
    collection: "products",
    where: { status: { equals: "published" } },
    limit: 100,
    sort: "title",
    depth: 1,
  });

  // 2. Fetch all available variants in one single query to eliminate N+1 database queries
  const { docs: allVariants } = await payload.find({
    collection: "product-variants",
    where: { isAvailable: { equals: true } },
    limit: 500,
  });

  const result: Product[] = [];

  for (const raw of products) {
    // Filter variants belonging to this product in memory
    const variants = allVariants.filter((v) => {
      const relId = typeof v.product === "object" && v.product !== null ? v.product.id : v.product;
      return String(relId) === String(raw.id);
    });

    if (variants.length === 0) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[catalog] "${String(raw.title)}" is published but hidden — add a Product Variant linked to this product with isAvailable checked.`,
        );
      }
      continue;
    }

    const product = mapPayloadToProduct(
      raw as unknown as Record<string, unknown>,
      variants as unknown as Record<string, unknown>[],
    );
    product.thumbnail = resolveProductImageUrl(product.thumbnail);
    product.images = product.images.map(resolveProductImageUrl).filter(Boolean);
    result.push(product);
  }

  const byId = new Map(result.map((p) => [p.id, p]));

  for (const raw of products) {
    const product = byId.get(String(raw.id));
    if (!product) continue;

    const bundled = (raw as { bundledProducts?: unknown }).bundledProducts;
    if (!Array.isArray(bundled) || bundled.length === 0) continue;

    const resolved: Product[] = [];
    for (const entry of bundled) {
      const bundledId =
        typeof entry === "object" && entry !== null && "id" in entry
          ? String((entry as { id: unknown }).id)
          : String(entry);
      const match = byId.get(bundledId);
      if (match) resolved.push(match);
    }
    if (resolved.length > 0) {
      product.bundledProducts = resolved;
    }
  }

  return result;
}

// Wrap catalog fetch in Next.js unstable_cache to serve instantly from CDN/memory cache.
// Tagged with 'catalog' and 'shop' for on-demand revalidation when products/variants are updated.
export const getCachedPublishedProducts = unstable_cache(
  async () => {
    return fetchPublishedProducts();
  },
  ["published-catalog-products-v2"],
  {
    tags: ["catalog", "shop"],
    revalidate: 3600, // Fallback revalidation of 1 hour
  }
);

export async function listProducts(family?: string): Promise<Product[]> {
  try {
    const mapped = await getCachedPublishedProducts();
    if (!family || family === "ALL") return mapped;
    return mapped.filter(
      (p) => p.fragrance?.family.toUpperCase() === family.toUpperCase(),
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
