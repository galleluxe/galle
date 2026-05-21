const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Format integer paise as INR display string */
export function formatINR(paise: number): string {
  return inrFormatter.format(paise / 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}
