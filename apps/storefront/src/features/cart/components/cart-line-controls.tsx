"use client";

import { useTransition } from "react";
import { useCartDrawer } from "@/providers/cart-provider";

interface CartLineControlsProps {
  variantId: string;
  productHandle: string;
  quantity: number;
}

export function CartLineControls({
  variantId,
  productHandle,
  quantity,
}: CartLineControlsProps) {
  const [pending, startTransition] = useTransition();
  const { updateCartItem, removeCartItem } = useCartDrawer();

  return (
    <div className="flex items-center gap-4 mt-4">
      <button
        type="button"
        disabled={pending || quantity <= 1}
        onClick={() =>
          startTransition(async () => {
            await updateCartItem(variantId, productHandle, quantity - 1);
          })
        }
        className="w-8 h-8 border border-outline-variant rounded-none flex items-center justify-center text-primary hover:bg-surface-container disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="font-body-md text-body-md w-6 text-center">{quantity}</span>
      <button
        type="button"
        disabled={pending || quantity >= 10}
        onClick={() =>
          startTransition(async () => {
            await updateCartItem(variantId, productHandle, quantity + 1);
          })
        }
        className="w-8 h-8 border border-outline-variant rounded-none flex items-center justify-center text-primary hover:bg-surface-container disabled:opacity-40"
        aria-label="Increase quantity"
      >
        +
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await removeCartItem(variantId, productHandle);
          })
        }
        className="font-label-caps text-[10px] text-outline hover:text-error ml-4 uppercase tracking-widest"
      >
        Remove
      </button>
    </div>
  );
}
