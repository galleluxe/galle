"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartDrawer } from "@/providers/cart-provider";
import { updateCartLine, removeFromCart } from "@/features/cart/server/actions";
import type { Cart } from "@/lib/catalog/types";
import { formatINR } from "@/lib/money";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, close } = useCartDrawer();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch("/api/cart")
      .then((r) => r.json())
      .then((data) => {
        setCart(data as Cart);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isOpen]);

  async function handleQty(
    variantId: string,
    productHandle: string,
    qty: number,
  ) {
    await updateCartLine({ variantId, productHandle, quantity: qty });
    router.refresh();
    const data = await fetch("/api/cart").then((r) => r.json());
    setCart(data as Cart);
    window.dispatchEvent(new Event("galle-cart-updated"));
  }

  async function handleRemove(variantId: string, productHandle: string) {
    await removeFromCart(variantId, productHandle);
    router.refresh();
    const data = await fetch("/api/cart").then((r) => r.json());
    setCart(data as Cart);
    window.dispatchEvent(new Event("galle-cart-updated"));
  }

  const isEmpty = !cart || cart.lines.length === 0;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-[−20px_0_60px_rgba(111,89,89,0.1)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "duration-300",
          )}
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-outline-variant/30 px-6 py-5">
            <Dialog.Title className="font-headline-sm text-headline-sm text-primary uppercase tracking-widest">
              Your Bag
              {cart && cart.itemCount > 0 && (
                <span className="ml-2 text-on-surface-variant font-body-md text-body-md normal-case tracking-normal">
                  ({cart.itemCount})
                </span>
              )}
            </Dialog.Title>
            <Dialog.Close
              className="text-outline hover:text-primary transition-colors"
              aria-label="Close bag"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined text-3xl text-outline animate-spin">
                  progress_activity
                </span>
              </div>
            ) : isEmpty ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <span className="material-symbols-outlined text-5xl text-outline-variant">
                  shopping_bag
                </span>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Your bag is empty.
                </p>
                <Dialog.Close asChild>
                  <Link
                    href="/shop"
                    className="font-label-caps text-label-caps text-primary uppercase tracking-widest hover:underline"
                  >
                    Explore the Boutique
                  </Link>
                </Dialog.Close>
              </div>
            ) : (
              <ul className="divide-y divide-outline-variant/20">
                {cart!.lines.map((line) => (
                  <li key={line.id} className="flex gap-4 py-5">
                    <Link
                      href={`/shop/${line.productHandle}`}
                      onClick={close}
                      className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container-low"
                    >
                      <Image
                        src={line.thumbnail}
                        alt={line.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex justify-between gap-2">
                        <Link
                          href={`/shop/${line.productHandle}`}
                          onClick={close}
                          className="font-headline-sm text-headline-sm text-primary hover:underline truncate"
                        >
                          {line.title}
                        </Link>
                        <p className="font-body-md text-body-md text-on-surface shrink-0 tabular-nums">
                          {formatINR(line.unitPricePaise * line.quantity)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={line.quantity <= 1}
                          onClick={() =>
                            handleQty(
                              line.variantId,
                              line.productHandle,
                              line.quantity - 1,
                            )
                          }
                          className="w-7 h-7 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-container disabled:opacity-40 transition-colors"
                        >
                          −
                        </button>
                        <span className="font-body-md text-body-md w-4 text-center">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={line.quantity >= 10}
                          onClick={() =>
                            handleQty(
                              line.variantId,
                              line.productHandle,
                              line.quantity + 1,
                            )
                          }
                          className="w-7 h-7 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-surface-container disabled:opacity-40 transition-colors"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(line.variantId, line.productHandle)
                          }
                          className="ml-auto font-label-caps text-[10px] text-outline hover:text-error uppercase tracking-widest transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {!isEmpty && cart && (
            <div className="border-t border-outline-variant/30 px-6 py-5 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                  Subtotal
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface tabular-nums">
                  {formatINR(cart.subtotalPaise)}
                </span>
              </div>
              <Dialog.Close asChild>
                <Link
                  href="/checkout"
                  className="w-full rounded-none bg-primary py-4 font-label-caps text-[11px] tracking-[0.12em] text-on-primary uppercase flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  Checkout
                </Link>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Link
                  href="/cart"
                  className="w-full py-2 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest flex items-center justify-center hover:text-primary transition-colors"
                >
                  View full bag
                </Link>
              </Dialog.Close>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
