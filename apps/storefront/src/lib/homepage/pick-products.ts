import type { Product } from "@/lib/catalog/types";

/** Preserve admin order when resolving relationship IDs to catalog products. */
export function pickProductsByIds(
  catalog: Product[],
  ids: string[],
): Product[] {
  if (ids.length === 0) return [];

  const byId = new Map(catalog.map((p) => [p.id, p]));
  const picked: Product[] = [];

  for (const id of ids) {
    const product = byId.get(id);
    if (product) picked.push(product);
  }

  return picked;
}

/** Combos: published products with bundled items linked. */
export function pickComboProducts(catalog: Product[]): Product[] {
  return catalog.filter(
    (p) => p.bundledProducts && p.bundledProducts.length > 0,
  );
}
