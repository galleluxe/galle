import { MedusaService } from "@medusajs/framework/utils";
import { FragranceProfile } from "./models/fragrance-profile";

class FragranceModuleService extends MedusaService({
  FragranceProfile,
}) {}

export default FragranceModuleService;
