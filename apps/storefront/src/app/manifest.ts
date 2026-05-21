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
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
