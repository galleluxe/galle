import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GALLE — Ethereal Essence",
    short_name: "GALLE",
    description:
      "Premium perfume house. India-first luxury fragrances crafted with olfactory grace.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f5",
    theme_color: "#6f5959",
    lang: "en-IN",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
