import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_MEDUSA_URL: z.string().url().default("http://localhost:9000"),
  NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: z.string().min(1),
  MEDUSA_BACKEND_URL: z.string().url().default("http://localhost:9000"),
  REVALIDATE_SECRET: z.string().min(1).default("galle_revalidate_secret"),
  RESEND_API_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  NEXT_PUBLIC_IMAGEKIT_ENDPOINT: z.string().url().default("https://ik.imagekit.io/galleluxe"),
});

const processEnv = {
  NEXT_PUBLIC_MEDUSA_URL: process.env.NEXT_PUBLIC_MEDUSA_URL,
  NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  MEDUSA_BACKEND_URL: process.env.MEDUSA_BACKEND_URL,
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_IMAGEKIT_ENDPOINT: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT,
};

// Validate environment variables
const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(parsed.error.format(), null, 2)
  );
  // Fail-safe default for non-production environments to avoid stopping Next.js builds completely
  if (process.env.NODE_ENV === "production") {
    throw new Error("Invalid environment variables");
  }
}

export const env = parsed.success ? parsed.data : envSchema.parse({
  NEXT_PUBLIC_MEDUSA_URL: "http://localhost:9000",
  NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: "pk_mock_key_for_build",
  MEDUSA_BACKEND_URL: "http://localhost:9000",
  REVALIDATE_SECRET: "galle_revalidate_secret",
  NEXT_PUBLIC_IMAGEKIT_ENDPOINT: "https://ik.imagekit.io/galleluxe",
});
export type Env = z.infer<typeof envSchema>;
export default env;
