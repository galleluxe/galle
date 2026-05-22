import type { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "orderNumber",
    defaultColumns: ["orderNumber", "email", "totalPaise", "status", "createdAt"],
  },
  fields: [
    {
      name: "orderNumber",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Paid", value: "paid" },
        { label: "Failed", value: "failed" },
        { label: "Refunded", value: "refunded" },
      ],
      defaultValue: "paid",
      required: true,
    },
    {
      name: "totalPaise",
      type: "number",
      required: true,
    },
    {
      name: "basePaise",
      type: "number",
      required: true,
      admin: { description: "Pre-GST taxable value" },
    },
    {
      name: "gstPaise",
      type: "number",
      required: true,
      admin: { description: "18% GST portion" },
    },
    {
      name: "razorpayPaymentId",
      type: "text",
    },
    {
      name: "razorpayOrderId",
      type: "text",
    },
    {
      name: "lines",
      type: "json",
      required: true,
    },
    {
      name: "shippingAddress",
      type: "json",
      required: true,
    },
    {
      name: "isGift",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "giftMessage",
      type: "textarea",
    },
  ],
};
