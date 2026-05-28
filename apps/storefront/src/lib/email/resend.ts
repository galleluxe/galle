import "server-only";
import type { ReactElement } from "react";
import { Resend } from "resend";

const STUB_KEY = "re_stub12345";

/** Resend is configured with a real API key (not missing / placeholder). */
export function isResendConfigured(): boolean {
  const key = process.env.RESEND_API_KEY?.trim();
  return Boolean(key && key !== STUB_KEY);
}

/**
 * Default sender. Use onboarding@resend.dev until your domain is verified in Resend.
 * Set RESEND_FROM_EMAIL on Vercel, e.g. `GALLE <orders@galleluxe.com>`.
 */
export function getResendFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() || "GALLE <onboarding@resend.dev>"
  );
}

export type SendResendResult =
  | { ok: true; id: string }
  | { ok: false; error: string; skipped?: boolean };

export async function sendResendEmail(options: {
  to: string | string[];
  subject: string;
  react?: ReactElement;
  text?: string;
  html?: string;
}): Promise<SendResendResult> {
  if (!isResendConfigured()) {
    console.warn(
      `[email] Skipped (RESEND_API_KEY missing or stub): ${options.subject} → ${options.to}`,
    );
    return {
      ok: false,
      error: "RESEND_API_KEY is not configured",
      skipped: true,
    };
  }

  const resend = new Resend(process.env.RESEND_API_KEY!.trim());
  const { data, error } = await resend.emails.send({
    from: getResendFromAddress(),
    to: options.to,
    subject: options.subject,
    react: options.react,
    text: options.text,
    html: options.html,
  });

  if (error) {
    console.error("[email] Resend rejected send:", {
      subject: options.subject,
      to: options.to,
      from: getResendFromAddress(),
      message: error.message,
      name: error.name,
    });
    return { ok: false, error: error.message };
  }

  if (!data?.id) {
    console.error("[email] Resend returned no message id:", options.subject);
    return { ok: false, error: "Resend returned no message id" };
  }

  console.info("[email] Sent:", options.subject, "id:", data.id);
  return { ok: true, id: data.id };
}
