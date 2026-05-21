import { z } from "zod";

const envSchema = z.object({
  PAYLOAD_SECRET: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1).optional(),
  REVALIDATE_SECRET: z.string().min(1).default("galle_revalidate_secret"),
  RESEND_API_KEY: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
  NEXT_PUBLIC_IMAGEKIT_ENDPOINT: z
    .string()
    .url()
    .default("https://ik.imagekit.io/galleluxe"),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

const processEnv = {
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  NEXT_PUBLIC_IMAGEKIT_ENDPOINT: process.env.NEXT_PUBLIC_IMAGEKIT_ENDPOINT,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    JSON.stringify(parsed.error.format(), null, 2),
  );
  if (process.env.NODE_ENV === "production") {
    throw new Error("Invalid environment variables");
  }
}

export const env = parsed.success
  ? parsed.data
  : envSchema.parse({
      REVALIDATE_SECRET: "galle_revalidate_secret",
      NEXT_PUBLIC_IMAGEKIT_ENDPOINT: "https://ik.imagekit.io/galleluxe",
    });

export type Env = z.infer<typeof envSchema>;
export default env;
