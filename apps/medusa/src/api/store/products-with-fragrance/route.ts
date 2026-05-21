import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import {
  ContainerRegistrationKeys,
  QueryContext,
} from "@medusajs/framework/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const { data: products } = await query.graph({
      entity: "product",
      fields: [
        "id",
        "title",
        "handle",
        "description",
        "thumbnail",
        "images.url",
        "variants.id",
        "variants.title",
        "variants.sku",
        "variants.inventory_quantity",
        "variants.calculated_price.*",
        "fragrance_profile.*",
      ],
      context: {
        variants: {
          calculated_price: QueryContext({
            currency_code: "inr",
          }),
        },
      },
    });

    res.json({ products });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
