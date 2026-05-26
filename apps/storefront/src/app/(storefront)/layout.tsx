import type { Metadata } from "next";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { Navbar } from "@/components/layout/navbar";
import { NewsletterPopup } from "@/components/layout/newsletter-popup";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/providers";
import { fontVariables, outfit } from "@/design-system/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "GALLE — Ethereal Essence",
    template: "%s | GALLE",
  },
  description:
    "Premium perfume house. India-first luxury fragrances crafted with olfactory grace.",
};

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={fontVariables}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- Material Symbols icon font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${outfit.className} min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <CartDrawer />
          <NewsletterPopup />
          <main className="flex-grow pb-12">{children}</main>
          <Footer />
          <MobileTabBar />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
