"use server";

import { z } from "zod";
import { getDb, isDbConfigured } from "@/lib/db/client";
import { newsletterSubscribers } from "@/lib/db/schema";
import { getPayloadClient } from "@/lib/payload";

const schema = z.object({ email: z.string().email() });

type Result = { success: boolean; message: string };

export async function subscribeNewsletter(
  _prevState: Result | null,
  formData: FormData,
): Promise<Result> {
  const parsed = schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { success: false, message: "Please enter a valid email address." };
  }

  const { email } = parsed.data;

  if (!isDbConfigured()) {
    console.error("[newsletter] DATABASE_URL is not set — submission not saved");
    return {
      success: false,
      message: "Newsletter is temporarily unavailable. Please try again later.",
    };
  }

  try {
    const db = getDb();
    if (!db) throw new Error("no db");
    await db
      .insert(newsletterSubscribers)
      .values({ email })
      .onConflictDoNothing();

    const { sendResendEmail } = await import("@/lib/email/resend");
    await sendResendEmail({
      to: email,
      subject: "Welcome to the GALLE atelier",
      text: `Welcome! You will be the first to know about new launches and scent stories.\n\n— Maison GALLE`,
    });

    return {
      success: true,
      message: "You're on the list. Expect whispers soon.",
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("unique")) {
      return { success: true, message: "You're already subscribed." };
    }
    console.error("[newsletter] error:", err);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

const vipSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  city: z.string().min(2, "City must be at least 2 characters."),
  marketingOptIn: z.boolean().optional(),
});

export async function vipSignupAction(input: {
  name: string;
  email: string;
  phone: string;
  city: string;
  marketingOptIn?: boolean;
}) {
  const parsed = vipSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message ?? "Invalid fields" };
  }

  try {
    const payload = await getPayloadClient();
    
    // Check if email already exists
    const existing = await payload.find({
      collection: "signups",
      where: {
        email: {
          equals: parsed.data.email,
        },
      },
    });

    if (existing.docs.length > 0) {
      return { success: true, message: "Welcome back! You are already subscribed to our list." };
    }

    await payload.create({
      collection: "signups",
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        city: parsed.data.city,
        marketingOptIn: parsed.data.marketingOptIn ?? true,
      },
    });

    const { sendResendEmail } = await import("@/lib/email/resend");
    await sendResendEmail({
      to: parsed.data.email,
      subject: "Welcome to the Maison GALLE Club",
      text: `Dear ${parsed.data.name},\n\nThank you for registering. You have joined the Maison Club, unlocking complimentary luxury samples with your first order.\n\nWarmest regards,\nMaison GALLE`,
    });

    return {
      success: true,
      message: "Welcome to the Maison Club. Complimentary samples await your first purchase.",
    };
  } catch (err) {
    console.error("VIP signup error:", err);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

