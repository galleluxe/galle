import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { Display, BodyText, Headline } from "@/components/typography/display";

const LINKS = [
  { href: "/account/orders", label: "Orders", icon: "package_2" },
  { href: "/account/addresses", label: "Addresses", icon: "location_on" },
  { href: "/account/profile", label: "Profile", icon: "person" },
  { href: "/track", label: "Track Order", icon: "local_shipping" },
  { href: "/sign-in", label: "Sign In", icon: "login" },
] as const;

export default function AccountPage() {
  return (
    <PageShell className="pt-8 pb-section-gap max-w-lg mx-auto">
      <section className="text-center mb-12">
        <Display className="text-display-lg-mobile md:text-display-lg mb-4">
          Profile
        </Display>
        <BodyText>Manage your GALLE experience.</BodyText>
      </section>

      <nav className="space-y-2">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-4 p-6 bg-surface-container-low rounded-xl hover:bg-surface-container transition-colors group"
          >
            <span className="material-symbols-outlined text-primary text-2xl">
              {link.icon}
            </span>
            <Headline size="sm" className="flex-1 text-on-surface group-hover:text-primary transition-colors">
              {link.label}
            </Headline>
            <span className="material-symbols-outlined text-outline">
              chevron_right
            </span>
          </Link>
        ))}
      </nav>
    </PageShell>
  );
}
