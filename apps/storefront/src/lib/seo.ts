import type { Metadata } from "next";
import type { Product } from "./catalog/types";
import { formatINR } from "./money";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://galle.com";

export function buildProductMetadata(product: Product): Metadata {
  const variant = product.variants[0];
  const price = variant ? formatINR(variant.pricePaise) : undefined;
  const ogImage = `${BASE_URL}/api/og/product/${product.handle}`;

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: `${product.title} | GALLE`,
      description: product.description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: product.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | GALLE`,
      description: product.description,
      images: [ogImage],
    },
    other: {
      ...(price && { "product:price:amount": price }),
      "product:price:currency": "INR",
    },
  };
}

export function buildProductJsonLd(product: Product) {
  const variant = product.variants[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((img) =>
      img.startsWith("http") ? img : `${BASE_URL}${img}`,
    ),
    brand: { "@type": "Brand", name: "GALLE" },
    offers: variant
      ? {
          "@type": "Offer",
          priceCurrency: "INR",
          price: (variant.pricePaise / 100).toFixed(2),
          availability:
            variant.inventory > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          url: `${BASE_URL}/shop/${product.handle}`,
        }
      : undefined,
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
