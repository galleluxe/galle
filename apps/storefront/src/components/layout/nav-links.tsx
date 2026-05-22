"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/shop", label: "Boutique" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "Atelier" },
] as const;

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex gap-8 items-center absolute left-1/2 -translate-x-1/2">
      {NAV_LINKS.map((link) => {
        // Active if pathname matches or starts with link.href (e.g. /shop/entice matches /shop)
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "font-label-caps text-label-caps font-semibold tracking-[0.2em] transition-colors duration-300 relative py-1",
              active
                ? "text-primary after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-px after:bg-secondary"
                : "text-outline hover:text-secondary",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
