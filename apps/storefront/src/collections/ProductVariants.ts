import type { CollectionConfig } from "payload";
import { revalidateTag } from "@/lib/revalidate";

export const ProductVariants: CollectionConfig = {
  slug: "product-variants",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "sku", "pricePaise", "inventory", "product"],
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
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
      index: true,
    },
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "Size label, e.g. 50ml or 100ml",
      },
    },
    {
      name: "sku",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "pricePaise",
      type: "number",
      required: true,
      min: 0,
      admin: {
        description: "GST-inclusive price in paise (₹6,500 = 650000)",
      },
    },
    {
      name: "inventory",
      type: "number",
      required: true,
      min: 0,
      defaultValue: 0,
    },
    {
      name: "isAvailable",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};
