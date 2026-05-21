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
  return null;
}
