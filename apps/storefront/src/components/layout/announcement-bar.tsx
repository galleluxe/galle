"use client";

import Link from "next/link";
import { useState } from "react";

const DEFAULT_MESSAGE =
  "Complimentary shipping on orders above ₹2,999 · Crafted in India";

export function AnnouncementBar({
  message = DEFAULT_MESSAGE,
  href = "/shop",
}: {
  message?: string;
  href?: string;
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-primary text-on-primary text-center py-2 px-10 text-xs font-label-caps uppercase tracking-widest">
      <Link href={href} className="hover:opacity-80 transition-opacity">
        {message}
      </Link>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-70 hover:opacity-100"
        aria-label="Dismiss announcement"
      >
        <span className="material-symbols-outlined text-sm leading-none">close</span>
      </button>
    </div>
  );
}
