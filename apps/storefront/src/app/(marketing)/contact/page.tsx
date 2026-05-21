"use client";

import { useActionState } from "react";
import { sendContactMessage } from "@/features/contact/server/actions";
import { PageShell } from "@/components/layout/page-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Display, BodyText } from "@/components/typography/display";

const initialState = null;

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);

  if (state?.success) {
    return (
      <PageShell className="pt-8 pb-section-gap max-w-lg mx-auto">
        <div className="text-center py-24 space-y-6">
          <span className="material-symbols-outlined text-5xl text-secondary">check_circle</span>
          <Display className="text-display-md-mobile">Message Sent</Display>
          <BodyText>{state.message}</BodyText>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="pt-8 pb-section-gap max-w-lg mx-auto">
      <section className="text-center mb-12">
        <Display className="mb-6">Contact</Display>
        <BodyText>Our concierge team responds within one business day.</BodyText>
      </section>

      <form action={formAction} className="space-y-6">
        <Input label="Name" name="name" required />
        <Input label="Email" name="email" type="email" required />
        <div className="flex flex-col gap-1 w-full">
          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
            Message
          </label>
          <textarea
            name="message"
            rows={5}
            required
            className="w-full bg-transparent border-0 border-b border-outline-variant py-3 font-body-md text-body-md text-on-surface focus:border-primary focus:outline-none resize-none"
          />
        </div>

        {state && !state.success && (
          <p className="text-error text-sm text-center">{state.message}</p>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={pending}>
          {pending ? "Sending…" : "Send Message"}
        </Button>
      </form>
    </PageShell>
  );
}
