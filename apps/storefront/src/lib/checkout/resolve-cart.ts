import { getPayloadClient } from "@/lib/payload";
import { splitGstInclusive } from "@/lib/gst";
import type { StoredLine } from "@/features/cart/server/store";
import type { Product, ScentFamily } from "@/lib/catalog/types";

export interface ResolvedCartLine {
  variantId: string;
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  sku: string;
  quantity: number;
  unitPricePaise: number;
  lineTotalPaise: number;
}

export interface ResolvedCart {
  lines: ResolvedCartLine[];
  subtotalPaise: number;
  basePaise: number;
  gstPaise: number;
}

function mapNotes(
  rows: { note?: string | null }[] | null | undefined,
): string[] {
  return (rows ?? []).map((r) => r.note).filter(Boolean) as string[];
}

export async function resolveCartLines(
  storedLines: StoredLine[],
): Promise<ResolvedCart> {
  if (storedLines.length === 0) {
    return { lines: [], subtotalPaise: 0, basePaise: 0, gstPaise: 0 };
  }

  const payload = await getPayloadClient();
  const resolved: ResolvedCartLine[] = [];

  for (const line of storedLines) {
    try {
      const variant = await payload.findByID({
        collection: "product-variants",
        id: line.variantId,
        depth: 1,
      });

      if (!variant || !variant.isAvailable) {
        continue;
      }

      // Safe stock fallback instead of crashing
      const availableQty = Math.max(0, Number(variant.inventory));
      const finalQty = Math.min(line.quantity, availableQty);
      if (finalQty <= 0) {
        continue;
      }

      const productRef = variant.product;
      const product =
        typeof productRef === "object" && productRef !== null
          ? productRef
          : await payload.findByID({
              collection: "products",
              id: String(productRef),
            });

      if (!product || product.status !== "published") {
        continue;
      }

      const unitPricePaise = Number(variant.pricePaise);
      resolved.push({
        variantId: String(variant.id),
        productHandle: String(product.handle),
        productTitle: String(product.title),
        variantTitle: String(variant.title),
        sku: String(variant.sku),
        quantity: finalQty,
        unitPricePaise,
        lineTotalPaise: unitPricePaise * finalQty,
      });
    } catch (e) {
      console.error("[resolveCartLines] skipped invalid cart line:", e);
      continue;
    }
  }

  const subtotalPaise = resolved.reduce((s, l) => s + l.lineTotalPaise, 0);
  const { basePaise, gstPaise } = splitGstInclusive(subtotalPaise);

  return { lines: resolved, subtotalPaise, basePaise, gstPaise };
}

/** Map Payload product + variants into storefront Product type. */
export function mapPayloadToProduct(
  raw: Record<string, unknown>,
  variants: Array<Record<string, unknown>>,
): Product {
  const fp = raw as {
    fragranceFamily?: string;
    topNotes?: { note?: string }[];
    heartNotes?: { note?: string }[];
    baseNotes?: { note?: string }[];
    longevityHours?: number;
    sillage?: string;
    occasion?: { label?: string }[];
    editorialPullquote?: string;
  };

  const fragrance =
    fp.fragranceFamily != null
      ? {
          family: fp.fragranceFamily as ScentFamily,
          topNotes: mapNotes(fp.topNotes),
          heartNotes: mapNotes(fp.heartNotes),
          baseNotes: mapNotes(fp.baseNotes),
          longevityHours: fp.longevityHours,
          sillage: fp.sillage as Product["fragrance"] extends { sillage?: infer S }
            ? S
            : undefined,
          occasion: (fp.occasion ?? [])
            .map((o) => o.label)
            .filter(Boolean) as string[],
          editorialPullquote: fp.editorialPullquote,
        }
      : undefined;

  const imageUrls = (
    (raw.imageUrls as { url?: string }[] | undefined) ?? []
  )
    .map((i) => i.url)
    .filter(Boolean) as string[];

  const thumbnailUrl = String(raw.thumbnailUrl ?? "");

  return {
    id: String(raw.id),
    handle: String(raw.handle).replace(/^\/+|\/+$/g, ""),
    title: String(raw.title),
    subtitle: raw.subtitle ? String(raw.subtitle) : undefined,
    description: String(raw.description ?? ""),
    noteLine: raw.noteLine ? String(raw.noteLine) : undefined,
    thumbnail: thumbnailUrl,
    images: imageUrls,
    tags: [],
    featured: Boolean(raw.featured),
    bentoSize: (raw.bentoSize as "large" | "standard") ?? "standard",
    variants: variants.map((v) => ({
      id: String(v.id),
      title: String(v.title),
      sku: String(v.sku),
      pricePaise: Number(v.pricePaise),
      inventory: Number(v.inventory),
    })),
    fragrance,
    bundledProducts: undefined,
  };
}
