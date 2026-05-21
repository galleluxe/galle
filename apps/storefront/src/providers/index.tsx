"use client";

import { NextIntlClientProvider } from "next-intl";
import { CartProvider } from "./cart-provider";
import messages from "../../messages/en-IN.json";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="en-IN" messages={messages}>
      <CartProvider>{children}</CartProvider>
    </NextIntlClientProvider>
  );
}
