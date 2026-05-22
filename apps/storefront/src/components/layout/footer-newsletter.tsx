"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/features/newsletter/server/actions";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [optIn, setOptIn] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ success?: boolean; text?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setMessage(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", email);

      const res = await subscribeNewsletter(null, formData);
      setMessage({
        success: res.success,
        text: res.message,
      });

      if (res.success) {
        setEmail("");
      }
    });
  };

  return (
    <div className="space-y-4">
      <p className="font-label-caps text-label-caps text-primary uppercase tracking-widest">
        Newsletter
      </p>
      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
        Subscribe to receive stories of scent, design, and exclusive previews.
      </p>

      {message ? (
        <p className={`font-body-md text-sm ${message.success ? "text-secondary" : "text-error"}`}>
          {message.text}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex border border-outline-variant/50 focus-within:border-primary transition-colors duration-200">
            <input
              type="email"
              placeholder="Your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              className="w-full bg-transparent px-4 py-3 font-body-md text-sm text-on-surface placeholder:text-outline focus:outline-none rounded-none"
            />
            <button
              type="submit"
              disabled={isPending}
              aria-label="Subscribe"
              className="px-4 text-primary hover:text-secondary disabled:opacity-50 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="footer-opt-in"
              checked={optIn}
              onChange={(e) => setOptIn(e.target.checked)}
              disabled={isPending}
              className="mt-0.5 w-4 h-4 rounded-none border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 accent-primary cursor-pointer"
            />
            <label
              htmlFor="footer-opt-in"
              className="font-body-md text-[11px] text-on-surface-variant leading-relaxed cursor-pointer select-none"
            >
              I consent to receiving exclusive emails from Maison GALLE.
            </label>
          </div>
        </form>
      )}
    </div>
  );
}
