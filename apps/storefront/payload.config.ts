import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { Users } from "./src/collections/Users";
import { Products } from "./src/collections/Products";
import { ProductVariants } from "./src/collections/ProductVariants";
import { Orders } from "./src/collections/Orders";
import { Signups } from "./src/collections/Signups";
import { Homepage } from "./src/globals/Homepage";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "",
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, "src"),
    },
  },
  collections: [Users, Products, ProductVariants, Orders, Signups],
  globals: [Homepage],
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
      max: process.env.VERCEL ? 3 : 10,
    },
    push:
      process.env.PAYLOAD_DISABLE_PUSH === "true"
        ? false
        : process.env.NODE_ENV !== "production",
  }),
  routes: {
    admin: "/admin",
    api: "/api/payload",
  },
});
