"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/shop", label: "Boutique", icon: "storefront" },
  { href: "/gallery", label: "Gallery", icon: "auto_awesome" },
  { href: "/about", label: "Atelier", icon: "architecture" },
  { href: "/account", label: "Profile", icon: "person" },
] as const;

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center py-4 px-2 bg-surface shadow-[0_-10px_30px_rgba(111,89,89,0.05)] rounded-t-full">
      {TABS.map((tab) => {
        const active =
          pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center justify-center px-6 py-2 scale-95 active:scale-90 transition-all duration-300",
              active
                ? "text-primary bg-primary-container/30 rounded-full"
                : "text-outline hover:text-secondary",
            )}
          >
            <span
              className="material-symbols-outlined text-2xl mb-1"
              style={
                active
                  ? { fontVariationSettings: "'FILL' 1, 'wght' 300" }
                  : undefined
              }
            >
              {tab.icon}
            </span>
            <span className="font-label-caps text-[10px] tracking-wider uppercase">
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
