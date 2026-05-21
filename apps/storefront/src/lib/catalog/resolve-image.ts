/** Normalize product image URLs for Next/Image + ImageKit loader. */
export function resolveProductImageUrl(url: string | undefined): string {
  if (!url) return "/5.png";

  if (url.startsWith("http://localhost:9000") || url.startsWith("https://localhost:9000")) {
    return url;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return url.startsWith("/") ? url : `/${url}`;
}
