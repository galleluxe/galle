export type ScentFamily =
  | "Floral"
  | "Woody"
  | "Fresh"
  | "Amber"
  | "Oriental"
  | "Citrus";

export interface FragranceProfile {
  family: ScentFamily;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  longevityHours?: number;
  sillage?: "Intimate" | "Moderate" | "Strong";
  occasion?: string[];
  editorialPullquote?: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  pricePaise: number;
  inventory: number;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  subtitle?: string;
  /** Card subtitle override, e.g. "Jasmine · Peony · White Musk" */
  noteLine?: string;
  thumbnail: string;
  images: string[];
  variants: ProductVariant[];
  fragrance?: FragranceProfile;
  tags: string[];
  featured?: boolean;
  bentoSize?: "large" | "standard";
}

export interface CartLine {
  id: string;
  variantId: string;
  productHandle: string;
  title: string;
  thumbnail: string;
  quantity: number;
  unitPricePaise: number;
}

export interface Cart {
  id: string;
  lines: CartLine[];
  itemCount: number;
  subtotalPaise: number;
}
