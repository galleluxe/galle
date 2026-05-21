import { resolveProductImageUrl } from "@/lib/catalog/resolve-image";
import { getPayloadClient } from "@/lib/payload";
import { mapPayloadToProduct } from "@/lib/checkout/resolve-cart";
import type { Product } from "./types";

async function fetchPublishedProducts(): Promise<Product[]> {
  const payload = await getPayloadClient();

  const { docs: products } = await payload.find({
    collection: "products",
    where: { status: { equals: "published" } },
    limit: 100,
    sort: "title",
  });

  const result: Product[] = [];

  for (const raw of products) {
    const { docs: variants } = await payload.find({
      collection: "product-variants",
      where: {
        and: [
          { product: { equals: raw.id } },
          { isAvailable: { equals: true } },
        ],
      },
      limit: 20,
    });

    if (variants.length === 0) continue;

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

export async function listProducts(family?: string): Promise<Product[]> {
  try {
    const mapped = await fetchPublishedProducts();
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
