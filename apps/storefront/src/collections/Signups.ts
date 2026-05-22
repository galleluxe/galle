import type { CollectionConfig } from "payload";

export const Signups: CollectionConfig = {
  slug: "signups",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "phone", "city", "createdAt"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
    },
    {
      name: "phone",
      type: "text",
      required: true,
    },
    {
      name: "city",
      type: "text",
      required: true,
    },
    {
      name: "marketingOptIn",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};
