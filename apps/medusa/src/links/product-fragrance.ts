import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import FragranceModule from "../modules/fragrance";

export default defineLink(
  ProductModule.linkable.product,
  FragranceModule.linkable.fragranceProfile,
);
