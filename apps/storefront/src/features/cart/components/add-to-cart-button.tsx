"use client";

import { useOptimistic, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Cart } from "@/lib/catalog/types";
import { useCartDrawer } from "@/providers/cart-provider";
import { toast } from "@/components/ui/use-toast";
import { addToCart } from "../server/actions";

interface AddToCartButtonProps {
  variantId: string;
  productHandle: string;
  cart: Cart;
  label?: string;
  className?: string;
  variant?: "primary" | "icon" | "card";
}

export function AddToCartButton({
  variantId,
  productHandle,
  cart,
  label = "Add to Bag",
  className,
  variant = "primary",
}: AddToCartButtonProps) {
  const [optimisticCount, addOptimistic] = useOptimistic(
    cart.itemCount,
    (state, qty: number) => state + qty,
  );
  const [pending, startTransition] = useTransition();
  const { open: openCart } = useCartDrawer();

  if (variant === "card") {
    return (
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            addOptimistic(1);
            await addToCart({ variantId, productHandle, quantity: 1 });
            window.dispatchEvent(new Event("galle-cart-updated"));
            toast({ title: "Added to your bag", description: "Your essence awaits checkout." });
            openCart();
          })
        }
        className={cn(
          "w-full rounded-none bg-primary py-3.5 font-label-caps text-[11px] tracking-[0.12em] text-on-primary uppercase transition-colors hover:bg-primary/90 disabled:opacity-50",
          className,
        )}
      >
        {label}
      </button>
    );
  }

  return (
    <Button
      variant={variant === "icon" ? "icon" : "primary"}
      disabled={pending}
      className={className}
      onClick={() =>
        startTransition(async () => {
          addOptimistic(1);
          await addToCart({ variantId, productHandle, quantity: 1 });
          window.dispatchEvent(new Event("galle-cart-updated"));
          toast({ title: "Added to your bag", description: "Your essence awaits checkout." });
          openCart();
        })
      }
    >
      {variant === "icon" ? (
        <span className="material-symbols-outlined">add_shopping_cart</span>
      ) : (
        label
      )}
      {variant === "primary" && optimisticCount > 0 && (
        <span className="sr-only"> ({optimisticCount} in bag)</span>
      )}
    </Button>
  );
}
