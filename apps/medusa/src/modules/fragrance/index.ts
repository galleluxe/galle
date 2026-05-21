import { Module } from "@medusajs/framework/utils";
import FragranceModuleService from "./service";

export const FRAGRANCE_MODULE = "fragrance";

export default Module(FRAGRANCE_MODULE, {
  service: FragranceModuleService,
});
