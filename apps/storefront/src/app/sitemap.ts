import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://galle.com";
  const products = await listProducts();

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/gallery`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
    ...products.map((p) => ({
      url: `${base}/shop/${p.handle}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
