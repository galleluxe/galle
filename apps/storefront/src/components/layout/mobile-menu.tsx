"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/shop", label: "Boutique" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "Atelier" },
  { href: "/account", label: "Account" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/gifting", label: "Gifting" },
] as const;

interface MobileMenuProps {
  pathname: string;
}

export function MobileMenu({ pathname }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="text-outline hover:opacity-70 transition-opacity md:hidden"
      >
        <span className="material-symbols-outlined text-2xl">
          {open ? "close" : "menu"}
        </span>
      </button>

      <DialogContent
        className={cn(
          "fixed inset-y-0 left-0 top-0 z-50 h-full w-[min(100vw,320px)] max-w-none",
          "translate-x-0 translate-y-0 rounded-none border-r border-outline-variant/30",
          "p-0 gap-0 data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        )}
      >
        <DialogTitle className="sr-only">Navigation menu</DialogTitle>
        <div className="flex flex-col h-full bg-surface">
          <div className="flex items-center justify-between px-6 h-20 border-b border-outline-variant/20">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="font-headline-md text-headline-md tracking-[0.3em] text-primary uppercase"
            >
              GALLE
            </Link>
          </div>
          <nav className="flex flex-col gap-1 p-6 flex-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "font-label-caps text-label-caps py-4 border-b border-outline-variant/15 transition-colors",
                  pathname.startsWith(link.href)
                    ? "text-primary"
                    : "text-outline hover:text-secondary",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </DialogContent>
    </Dialog>
  );
}
