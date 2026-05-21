import { Modules } from "@medusajs/framework/utils";

export default async function resetAdminPassword({
  container,
}: {
  container: any;
}) {
  const email = process.env.ADMIN_EMAIL ?? "galleluxe@gmail.com";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error(
      "Set ADMIN_PASSWORD (and optionally ADMIN_EMAIL) before running this script."
    );
  }

  const authService = container.resolve(Modules.AUTH);
  const result = await authService.updateProvider("emailpass", {
    entity_id: email,
    password,
  });

  if (!result?.success) {
    throw new Error(result?.error ?? "Failed to reset admin password");
  }

  process.stderr.write(`\nPassword updated for ${email}\n`);
}
