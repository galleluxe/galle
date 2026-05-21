import { Modules } from "@medusajs/framework/utils";

export default async function createKey({ container }: { container: any }) {
  const userModule = container.resolve(Modules.USER);
  const adminUser = await userModule.listUsers({ email: "galleluxe@gmail.com" }).then((u: any) => u[0]);
  
  if (!adminUser) {
    throw new Error("Admin user not found. Run medusa user first.");
  }

  const apiKeyModule = container.resolve(Modules.API_KEY);
  const created = await apiKeyModule.createApiKeys({
    title: "Storefront Key",
    type: "publishable",
    created_by: adminUser.id,
  });
  const key = Array.isArray(created) ? created[0] : created;
  const token =
    key?.token ?? key?.redacted ?? key?.id ?? JSON.stringify(key, null, 2);

  // stderr so pnpm/medusa exec does not swallow the line
  process.stderr.write(
    `\n\n=== COPY THIS INTO storefront .env.local ===\nNEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${token}\n===========================================\n\n`
  );
}
