/** India GST on perfumes (B2C, inclusive display pricing). */
export const GST_RATE = 0.18;

/** Split GST-inclusive paise into base + 18% GST (for receipts/invoices). */
export function splitGstInclusive(totalPaise: number): {
  totalPaise: number;
  basePaise: number;
  gstPaise: number;
} {
  const basePaise = Math.round(totalPaise / (1 + GST_RATE));
  const gstPaise = totalPaise - basePaise;
  return { totalPaise, basePaise, gstPaise };
}
