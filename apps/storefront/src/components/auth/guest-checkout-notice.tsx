import Link from "next/link";
import { BodyText } from "@/components/typography/display";

interface GuestCheckoutNoticeProps {
  className?: string;
}

/** Shown on auth/account pages while customer login is not wired up. */
export function GuestCheckoutNotice({ className }: GuestCheckoutNoticeProps) {
  return (
    <div
      className={`rounded-xl border border-outline-variant/30 bg-primary-container/15 px-5 py-4 text-center ${className ?? ""}`}
      role="status"
    >
      <BodyText className="text-on-surface text-sm leading-relaxed">
        Customer accounts are coming soon. You can shop and pay as a guest — order
        confirmation is sent to your email after checkout.
      </BodyText>
      <Link
        href="/shop"
        className="mt-3 inline-block font-label-caps text-[10px] uppercase tracking-widest text-primary hover:text-secondary transition-colors"
      >
        Continue to Boutique →
      </Link>
    </div>
  );
}
