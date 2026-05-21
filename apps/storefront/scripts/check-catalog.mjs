/**
 * Lists published products and whether they have available variants (storefront visibility).
 * Run: node scripts/check-catalog.mjs
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, "../.env.local");

function loadEnv(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

const env = loadEnv(envPath);
for (const [k, v] of Object.entries(env)) {
  if (!process.env[k]) process.env[k] = v;
}

const { getPayload } = await import("payload");
const config = (await import("../payload.config.ts")).default;

const payload = await getPayload({ config });

const { docs: products } = await payload.find({
  collection: "products",
  where: { status: { equals: "published" } },
  limit: 100,
});

console.log("\nPublished products vs storefront visibility:\n");

for (const p of products) {
  const { docs: variants } = await payload.find({
    collection: "product-variants",
    where: {
      and: [
        { product: { equals: p.id } },
        { isAvailable: { equals: true } },
      ],
    },
    limit: 20,
  });

  const { docs: allVariants } = await payload.find({
    collection: "product-variants",
    where: { product: { equals: p.id } },
    limit: 20,
  });

  const visible = variants.length > 0;
  console.log(`${visible ? "✓ VISIBLE" : "✗ HIDDEN "}  ${p.title} (handle: ${p.handle})`);
  if (!visible) {
    if (allVariants.length === 0) {
      console.log("    → No Product Variant linked. Create one in Admin → Product Variants.");
    } else {
      console.log(`    → ${allVariants.length} variant(s) exist but none are isAvailable=true.`);
      for (const v of allVariants) {
        console.log(`       - ${v.title} | available: ${v.isAvailable} | inventory: ${v.inventory}`);
      }
    }
  } else {
    for (const v of variants) {
      console.log(`    → ${v.title} | ₹${(v.pricePaise / 100).toFixed(2)} (incl. GST)`);
    }
  }
}

console.log("");
