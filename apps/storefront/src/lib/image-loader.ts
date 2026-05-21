export default function imageKitLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Local public assets — avoid routing through ImageKit
  if (src.startsWith("/") && !src.startsWith("//")) {
    return src;
  }

  // Medusa static uploads, other remotes
  if (src.startsWith("http") && !src.includes("ik.imagekit.io")) {
    return src;
  }

  // Normalize leading slash
  const cleanSrc = src.startsWith("/") ? src.slice(1) : src;

  // Build ImageKit transform params
  const params = [`w-${width}`];
  if (quality) {
    params.push(`q-${quality}`);
  } else {
    params.push("q-80"); // default quality
  }
  params.push("f-auto"); // auto format (AVIF/WebP)
  const paramsString = params.join(",");

  const endpoint =
    process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT || "https://ik.imagekit.io/galleluxe";

  if (cleanSrc.startsWith("http")) {
    // If it is already an ImageKit URL, we can append parameters
    const url = new URL(cleanSrc);
    url.searchParams.set("tr", paramsString);
    return url.toString();
  }

  return `${endpoint.replace(/\/$/, "")}/${cleanSrc}?tr=${paramsString}`;
}
