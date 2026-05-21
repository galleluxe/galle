import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import ShiprocketProviderService from "./service";

export default ModuleProvider(Modules.FULFILLMENT, {
  services: [ShiprocketProviderService],
});
