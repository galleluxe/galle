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
    console.log(`[contact] Message from ${name} <${email}>: ${message}`);
    return { success: true, message: "Thank you. We will respond within 2 business days." };
  }

  try {
    const db = getDb();
    if (!db) throw new Error("no db");
    await db.insert(contactMessages).values({ name, email, message });

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(RESEND_API_KEY);
      await Promise.all([
        resend.emails.send({
          from: "GALLE <hello@galle.com>",
          to: "hello@galle.com",
          subject: `Contact form: ${name}`,
          text: `From: ${name} <${email}>\n\n${message}`,
        }),
        resend.emails.send({
          from: "GALLE <hello@galle.com>",
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
