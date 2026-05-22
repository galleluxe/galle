import Link from "next/link";
import { CartButton } from "./cart-button";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";
import { SearchButton } from "@/features/search/components/search-button";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full bg-surface/80 backdrop-blur-md shadow-[0_10px_30px_rgba(111,89,89,0.05)] transition-all duration-500">
      <div className="mx-auto flex h-20 w-full max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
        <MobileMenu />

        <Link
          href="/"
          className="font-headline-md text-headline-md tracking-[0.3em] text-primary uppercase absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
        >
          GALLE
        </Link>

        <NavLinks />

        <div className="flex items-center gap-4">
          <SearchButton />
          <CartButton />
          <Link
            href="/account"
            className="hidden md:flex text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Account"
          >
            <span className="material-symbols-outlined text-2xl">person</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
