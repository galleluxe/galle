import type { Product } from "./types";

/** Short note line for product cards, e.g. "Jasmine · Peony · White Musk" */
export function getProductNoteLine(product: Product): string {
  if (product.noteLine) return product.noteLine;

  const f = product.fragrance;
  if (!f) return product.subtitle ?? "";

  const notes = [...f.topNotes, ...f.heartNotes, ...f.baseNotes].slice(0, 3);
  return notes.join(" · ");
}
