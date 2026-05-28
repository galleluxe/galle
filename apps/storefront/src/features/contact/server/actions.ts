"use server";

import { z } from "zod";
import { getDb, isDbConfigured } from "@/lib/db/client";
import { contactMessages } from "@/lib/db/schema";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type Result = { success: boolean; message: string };

export async function sendContactMessage(
  _prevState: Result | null,
  formData: FormData,
): Promise<Result> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Please fill in all fields." };
  }

  const { name, email, message } = parsed.data;

  if (!isDbConfigured()) {
    console.error("[contact] DATABASE_URL is not set — message not saved");
    return {
      success: false,
      message: "Contact form is temporarily unavailable. Please try again later.",
    };
  }

  try {
    const db = getDb();
    if (!db) throw new Error("no db");
    await db.insert(contactMessages).values({ name, email, message });

    const { isResendConfigured, sendResendEmail } = await import("@/lib/email/resend");
    const inbox =
      process.env.CONTACT_INBOX_EMAIL?.trim() ||
      process.env.RESEND_ORDER_NOTIFY_EMAIL?.trim();

    if (isResendConfigured() && inbox) {
      await Promise.all([
        sendResendEmail({
          to: inbox,
          subject: `Contact form: ${name}`,
          text: `From: ${name} <${email}>\n\n${message}`,
        }),
        sendResendEmail({
          to: email,
          subject: "We received your message",
          text: `Hi ${name},\n\nThank you for reaching out. We will respond within 2 business days.\n\n— Maison GALLE`,
        }),
      ]);
    }

    return { success: true, message: "Thank you. We will respond within 2 business days." };
  } catch (err) {
    console.error("[contact] error:", err);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}
