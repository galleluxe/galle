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

  return result;
}

// Wrap catalog fetch in Next.js unstable_cache to serve instantly from CDN/memory cache.
// Tagged with 'catalog' and 'shop' for on-demand revalidation when products/variants are updated.
export const getCachedPublishedProducts = unstable_cache(
  async () => {
    return fetchPublishedProducts();
  },
  ["published-catalog-products-v1"],
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
