import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Display, BodyText, Headline } from "@/components/typography/display";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  return (
    <PageShell className="pt-4 md:pt-8 pb-12 md:pb-section-gap max-w-md mx-auto text-center space-y-10">
      <section className="space-y-4">
        <Display className="text-display-lg-mobile md:text-display-lg">
          My Atelier
        </Display>
        <BodyText className="max-w-sm mx-auto text-on-surface-variant/90">
          GALLE uses premium Guest Checkout to ensure a seamless, friction-free purchasing experience.
        </BodyText>
      </section>

      <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-8 space-y-6 text-center ambient-shadow">
        <span className="material-symbols-outlined text-4xl text-secondary block mx-auto">
          local_shipping
        </span>
        <div className="space-y-2">
          <Headline size="sm" className="text-primary">Order Tracking</Headline>
          <BodyText className="text-sm text-on-surface-variant">
            Review delivery status, shipping updates, and purchase invoices for your guest orders.
          </BodyText>
        </div>
        <Button asChild variant="primary" className="w-full">
          <Link href="/track">Track Guest Order</Link>
        </Button>
      </div>

      <div className="border border-outline-variant/20 rounded-2xl p-6 text-left space-y-3 bg-surface/50">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined text-xl">info</span>
          <p className="font-label-caps text-xs uppercase tracking-widest font-semibold">Atelier Accounts</p>
        </div>
        <BodyText className="text-xs text-on-surface-variant/80">
          Registered customer accounts with olfactory wishlists, fragrance subscriptions, and member-exclusive early-access collections are currently under active curation. Stay tuned.
        </BodyText>
      </div>

      <div className="pt-4">
        <Button asChild variant="ghost" className="text-xs">
          <Link href="/shop">Explore the Boutique</Link>
        </Button>
      </div>
    </PageShell>
  );
}
