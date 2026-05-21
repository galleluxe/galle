"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/features/newsletter/server/actions";
import { Button } from "@/components/ui/button";

const initialState = null;

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initialState);

  if (state?.success) {
    return (
      <p className="font-body-md text-body-md text-secondary py-4">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
      <input
        type="email"
        name="email"
        placeholder="your@email.com"
        required
        className="flex-1 border-b border-outline-variant bg-transparent py-3 font-body-md text-center sm:text-left focus:border-primary focus:outline-none"
        aria-label="Email for newsletter"
      />
      {state && !state.success && (
        <p className="text-error text-xs w-full text-center">{state.message}</p>
      )}
      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "…" : "Subscribe"}
      </Button>
    </form>
  );
}
