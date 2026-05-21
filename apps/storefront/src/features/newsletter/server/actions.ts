"use server";

import { z } from "zod";
import { getDb, isDbConfigured } from "@/lib/db/client";
import { newsletterSubscribers } from "@/lib/db/schema";

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
    console.log(`[newsletter] Subscription from ${email} (DB not configured)`);
    return {
      success: true,
      message: "You're on the list. Expect whispers soon.",
    };
  }

  try {
    const db = getDb();
    if (!db) throw new Error("no db");
    await db
      .insert(newsletterSubscribers)
      .values({ email })
      .onConflictDoNothing();

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(RESEND_API_KEY);
      await resend.emails.send({
        from: "GALLE <hello@galle.com>",
        to: email,
        subject: "Welcome to the GALLE atelier",
        text: `Welcome! You will be the first to know about new launches and scent stories.\n\n— Maison GALLE`,
      });
    }

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
