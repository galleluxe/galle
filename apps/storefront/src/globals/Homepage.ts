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
      label: "Promo banner carousel",
      type: "array",
      admin: {
        description:
          "Full-width banners directly under the navbar (desktop + mobile ImageKit URLs). Slides advance every 2 seconds.",
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
    {
      type: "collapsible",
      label: "New Launch section",
      fields: [
        {
          name: "launchSectionTitle",
          type: "text",
          defaultValue: "New Launch",
          label: "Section title",
        },
        {
          name: "launchProducts",
          type: "relationship",
          relationTo: "products",
          hasMany: true,
          maxRows: 5,
          admin: {
            description:
              "Pick 4–5 published perfumes for the New Launch carousel (auto-scrolls every 3 seconds).",
          },
        },
      ],
    },
    {
      type: "collapsible",
      label: "Gifting section",
      fields: [
        {
          name: "giftingSectionTitle",
          type: "text",
          defaultValue: "Gifting",
          label: "Section title",
        },
        {
          name: "giftingSectionSubtitle",
          type: "textarea",
          label: "Section subtitle",
        },
        {
          name: "giftingProducts",
          type: "relationship",
          relationTo: "products",
          hasMany: true,
          admin: {
            description:
              "Combo / gift sets for the homepage gifting carousel (e.g. bundles with bundled products).",
          },
        },
      ],
    },
  ],
};
