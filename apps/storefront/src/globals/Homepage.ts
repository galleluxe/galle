import type { GlobalConfig } from "payload";
import { revalidateTag } from "@/lib/revalidate";

export const Homepage: GlobalConfig = {
  slug: "homepage",
  label: "Homepage",
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTag("homepage");
        revalidateTag("shop");
      },
    ],
  },
  fields: [
    {
      name: "heroSlides",
      label: "Hero carousel",
      type: "array",
      admin: {
        description:
          "Full-width homepage banners. Add separate ImageKit URLs for desktop (wide) and mobile (tall). Slides advance every 2 seconds.",
      },
      fields: [
        {
          name: "desktopImageUrl",
          type: "text",
          required: true,
          label: "Desktop image URL",
          admin: {
            description: "Wide banner for md+ screens",
          },
        },
        {
          name: "mobileImageUrl",
          type: "text",
          required: true,
          label: "Mobile image URL",
          admin: {
            description: "Tall banner for phones",
          },
        },
        {
          name: "alt",
          type: "text",
          label: "Image alt text",
        },
        {
          name: "eyebrow",
          type: "text",
          admin: { description: "Small line above headline (optional)" },
        },
        {
          name: "headline",
          type: "text",
          admin: { description: "Main headline overlay (optional)" },
        },
        {
          name: "ctaLabel",
          type: "text",
          label: "Button label",
        },
        {
          name: "linkUrl",
          type: "text",
          label: "Button link",
          admin: { description: "e.g. /shop or /shop/entice" },
        },
      ],
    },
  ],
};
