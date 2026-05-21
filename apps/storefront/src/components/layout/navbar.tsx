import Link from "next/link";
import { CartButton } from "./cart-button";
import { MobileMenu } from "./mobile-menu";
import { SearchButton } from "@/features/search/components/search-button";
import { getCart } from "@/features/cart/server/store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/shop", label: "Boutique" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "Atelier" },
] as const;

interface NavbarProps {
  pathname: string;
}

export async function Navbar({ pathname }: NavbarProps) {
  const cart = await getCart();

  return (
    <header className="fixed top-0 z-50 w-full bg-surface/80 backdrop-blur-md shadow-[0_10px_30px_rgba(111,89,89,0.05)] transition-all duration-500">
      <div className="mx-auto flex h-20 w-full max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
        <MobileMenu pathname={pathname} />

        <Link
          href="/"
          className="font-headline-md text-headline-md tracking-[0.3em] text-primary uppercase absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0"
        >
          GALLE
        </Link>

        <nav className="hidden md:flex gap-8 items-center absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "font-label-caps text-label-caps transition-colors duration-300 relative",
                pathname.startsWith(link.href)
                  ? "text-primary after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-px after:bg-secondary"
                  : "text-outline hover:text-secondary",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <SearchButton />
          <CartButton itemCount={cart.itemCount} />
          <Link
            href="/account"
            className="hidden md:flex text-outline hover:opacity-70 transition-opacity"
            aria-label="Account"
          >
            <span className="material-symbols-outlined text-2xl">person</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
