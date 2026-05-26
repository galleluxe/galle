import type { CollectionConfig } from "payload";
import { revalidateTag } from "@/lib/revalidate";

const scentFamilies = [
  "Floral",
  "Woody",
  "Fresh",
  "Amber",
  "Oriental",
  "Citrus",
] as const;

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "handle", "status", "featured", "updatedAt"],
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTag("shop");
        revalidateTag("catalog");
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "handle",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "URL slug, e.g. entice",
      },
    },
    {
      name: "subtitle",
      type: "text",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "noteLine",
      type: "text",
      admin: {
        description: 'Card subtitle, e.g. "Jasmine · Peony · White Musk"',
      },
    },
    {
      name: "thumbnailUrl",
      type: "text",
      required: true,
      admin: {
        description: "ImageKit URL for primary image",
      },
    },
    {
      name: "imageUrls",
      type: "array",
      fields: [{ name: "url", type: "text", required: true }],
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "Show on homepage under “Discover Our Iconics & Best Sellers”. You can feature as many products as you like.",
      },
    },
    {
      name: "bentoSize",
      type: "select",
      options: [
        { label: "Standard", value: "standard" },
        { label: "Large", value: "large" },
      ],
      defaultValue: "standard",
    },
    {
      name: "bundledProducts",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
      admin: {
        description:
          "For combos: link the individual perfumes included in this bundle.",
      },
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      defaultValue: "draft",
      required: true,
    },
    {
      type: "collapsible",
      label: "Fragrance profile",
      fields: [
        {
          name: "fragranceFamily",
          type: "select",
          options: scentFamilies.map((f) => ({ label: f, value: f })),
        },
        {
          name: "topNotes",
          type: "array",
          fields: [{ name: "note", type: "text" }],
        },
        {
          name: "heartNotes",
          type: "array",
          fields: [{ name: "note", type: "text" }],
        },
        {
          name: "baseNotes",
          type: "array",
          fields: [{ name: "note", type: "text" }],
        },
        {
          name: "longevityHours",
          type: "number",
          min: 0,
        },
        {
          name: "sillage",
          type: "select",
          options: [
            { label: "Intimate", value: "Intimate" },
            { label: "Moderate", value: "Moderate" },
            { label: "Strong", value: "Strong" },
          ],
        },
        {
          name: "occasion",
          type: "array",
          fields: [{ name: "label", type: "text" }],
        },
        {
          name: "editorialPullquote",
          type: "textarea",
        },
      ],
    },
  ],
};
