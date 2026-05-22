"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import Link from "next/link";
import { useCartDrawer } from "@/providers/cart-provider";
import { formatINR } from "@/lib/money";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { isOpen, close, cart, loading, updateCartItem, removeCartItem } = useCartDrawer();

  const isEmpty = !cart || cart.lines.length === 0;

  async function handleQty(
    variantId: string,
    productHandle: string,
    qty: number,
  ) {
    await updateCartItem(variantId, productHandle, qty);
  }

  async function handleRemove(variantId: string, productHandle: string) {
    await removeCartItem(variantId, productHandle);
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className={cn(
            "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-[−20px_0_60px_rgba(111,89,89,0.1)] focus:outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "duration-300",
          )}
          aria-describedby={undefined}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-outline-variant/30 px-6 py-5">
            <Dialog.Title className="font-headline-sm text-headline-sm text-on-surface uppercase tracking-widest">
              Your Bag
              {cart && cart.itemCount > 0 && (
                <span className="ml-2 text-on-surface-variant font-body-md text-body-md normal-case tracking-normal font-semibold">
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
          <div className="flex-1 overflow-y-auto px-6 py-4 hide-scrollbar">
            {loading && !cart ? (
              <div className="flex items-center justify-center py-20">
                <span className="material-symbols-outlined text-3xl text-outline animate-spin">
                  progress_activity
                </span>
              </div>
            ) : isEmpty ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4 animate-fade-in">
                <span className="material-symbols-outlined text-5xl text-outline-variant">
                  shopping_bag
                </span>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Your bag is empty.
                </p>
                <Dialog.Close asChild>
                  <Link
                    href="/shop"
                    className="font-label-caps text-label-caps text-primary uppercase tracking-widest hover:underline font-semibold"
                  >
                    Explore the Boutique
                  </Link>
                </Dialog.Close>
              </div>
            ) : (
              <ul className="divide-y divide-outline-variant/20">
                {cart!.lines.map((line) => (
                  <li key={line.id} className="flex gap-4 py-5 animate-fade-in">
                    <Link
                      href={`/shop/${line.productHandle}`}
                      onClick={close}
                      className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-none border border-outline-variant/15 bg-surface-container-low"
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
                          className="font-headline-sm text-sm text-on-surface hover:underline truncate font-semibold"
                        >
                          {line.title}
                        </Link>
                        <p className="font-body-md text-body-md text-on-surface shrink-0 tabular-nums font-medium">
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
                          className="w-7 h-7 rounded-none border border-outline-variant/40 flex items-center justify-center text-primary hover:bg-surface-container disabled:opacity-40 transition-colors"
                        >
                          −
                        </button>
                        <span className="font-body-md text-body-md w-4 text-center font-medium">
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
                          className="w-7 h-7 rounded-none border border-outline-variant/40 flex items-center justify-center text-primary hover:bg-surface-container disabled:opacity-40 transition-colors"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(line.variantId, line.productHandle)
                          }
                          className="ml-auto font-label-caps text-[10px] text-outline hover:text-error uppercase tracking-widest transition-colors font-semibold"
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
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest font-semibold">
                  Subtotal
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface tabular-nums font-bold">
                  {formatINR(cart.subtotalPaise)}
                </span>
              </div>
              <Dialog.Close asChild>
                <Link
                  href="/checkout"
                  className="w-full rounded-none bg-primary py-4 font-label-caps text-[11px] tracking-[0.12em] text-on-primary uppercase flex items-center justify-center hover:bg-primary/90 transition-colors font-semibold"
                >
                  Checkout
                </Link>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Link
                  href="/cart"
                  className="w-full py-2 font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest flex items-center justify-center hover:text-primary transition-colors font-semibold"
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
