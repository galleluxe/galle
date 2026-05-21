import Link from "next/link";
import { PageShell } from "./page-shell";

export function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/30 mt-section-gap pb-28 md:pb-16">
      <PageShell className="py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <p className="font-headline-md text-headline-md tracking-[0.3em] text-primary uppercase mb-4">
            GALLE
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
            Ethereal essences crafted in India. Olfactory grace for the
            discerning.
          </p>
        </div>
        <div>
          <p className="font-label-caps text-label-caps text-primary mb-4 uppercase tracking-widest">
            Explore
          </p>
          <ul className="space-y-2 font-body-md text-body-md text-on-surface-variant">
            <li>
              <Link href="/shop" className="hover:text-primary transition-colors">
                Boutique
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-primary transition-colors">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary transition-colors">
                Atelier
              </Link>
            </li>
            <li>
              <Link href="/journal" className="hover:text-primary transition-colors">
                Journal
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-label-caps text-label-caps text-primary mb-4 uppercase tracking-widest">
            Support
          </p>
          <ul className="space-y-2 font-body-md text-body-md text-on-surface-variant">
            <li>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/legal/shipping" className="hover:text-primary transition-colors">
                Shipping
              </Link>
            </li>
            <li>
              <Link href="/legal/returns" className="hover:text-primary transition-colors">
                Returns
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </PageShell>
      <PageShell className="pb-8 border-t border-outline-variant/20 pt-8">
        <p className="font-label-caps text-[10px] text-on-surface-variant tracking-widest text-center md:text-left">
          © {new Date().getFullYear()} GALLE. All rights reserved.
        </p>
      </PageShell>
    </footer>
  );
}
