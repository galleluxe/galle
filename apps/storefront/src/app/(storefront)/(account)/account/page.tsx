import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { GuestCheckoutNotice } from "@/components/auth/guest-checkout-notice";
import { Display, BodyText, Headline } from "@/components/typography/display";

const LINKS = [
  { href: "/shop", label: "Shop", icon: "storefront", enabled: true },
  { href: "/account/orders", label: "Orders", icon: "package_2", enabled: false },
  { href: "/account/addresses", label: "Addresses", icon: "location_on", enabled: false },
  { href: "/account/profile", label: "Profile", icon: "person", enabled: false },
  { href: "/track", label: "Track Order", icon: "local_shipping", enabled: false },
] as const;

export default function AccountPage() {
  return (
    <PageShell className="pt-4 md:pt-8 pb-section-gap max-w-lg mx-auto">
      <section className="text-center mb-8">
        <Display className="text-display-md-mobile md:text-display-lg mb-3">
          Profile
        </Display>
        <BodyText>Manage your GALLE experience.</BodyText>
      </section>

      <GuestCheckoutNotice className="mb-8" />

      <nav className="space-y-2" aria-label="Account">
        {LINKS.map((link) =>
          link.enabled ? (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-4 p-5 md:p-6 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors group"
            >
              <span className="material-symbols-outlined text-primary text-2xl">
                {link.icon}
              </span>
              <Headline size="sm" className="flex-1 text-on-surface group-hover:text-primary transition-colors">
                {link.label}
              </Headline>
              <span className="material-symbols-outlined text-outline">chevron_right</span>
            </Link>
          ) : (
            <div
              key={link.href}
              className="flex items-center gap-4 p-5 md:p-6 bg-surface-container-low/60 rounded-xl opacity-60 cursor-not-allowed"
              aria-disabled="true"
              title="Available when customer accounts launch"
            >
              <span className="material-symbols-outlined text-outline text-2xl">
                {link.icon}
              </span>
              <Headline size="sm" className="flex-1 text-on-surface-variant">
                {link.label}
              </Headline>
              <span className="font-label-caps text-[9px] uppercase tracking-widest text-outline">
                Soon
              </span>
            </div>
          ),
        )}
      </nav>
    </PageShell>
  );
}
