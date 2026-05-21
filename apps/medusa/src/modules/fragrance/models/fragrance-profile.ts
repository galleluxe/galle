import { model } from "@medusajs/framework/utils";

export const FragranceProfile = model.define("fragrance_profile", {
  id: model.id().primaryKey(),
  product_id: model.text().unique(),
  family: model.enum([
    "Woody",
    "Floral",
    "Fresh",
    "Amber",
    "Oriental",
    "Citrus",
  ]),
  top_notes: model.json(),
  heart_notes: model.json(),
  base_notes: model.json(),
  longevity_hours: model.number().nullable(),
  sillage: model.enum(["Intimate", "Moderate", "Strong"]).nullable(),
  occasion: model.json().nullable(),
  editorial_pullquote: model.text().nullable(),
});
