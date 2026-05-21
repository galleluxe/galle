import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "./request";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "never",
});
