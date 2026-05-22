"use client";

import { useTransition, useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Cart } from "@/lib/catalog/types";
import { useCartDrawer } from "@/providers/cart-provider";
import { toast } from "@/components/ui/use-toast";

interface AddToCartButtonProps {
  variantId: string;
  productHandle: string;
  cart?: Cart;
  label?: string;
  className?: string;
  variant?: "primary" | "icon" | "card";
}

export function AddToCartButton({
  variantId,
  productHandle,
  cart: serverCart,
  label = "Add to Bag",
  className,
  variant = "primary",
}: AddToCartButtonProps) {
  const [pending, startTransition] = useTransition();
  const { open: openCart, addCartItem, cart: clientCart } = useCartDrawer();

  const currentCart = clientCart || serverCart;
  const currentItemCount = currentCart?.itemCount || 0;

  const [optimisticCount, addOptimistic] = useOptimistic(
    currentItemCount,
    (state, qty: number) => state + qty,
  );

  const handleAdd = () => {
    startTransition(async () => {
      addOptimistic(1);
      await addCartItem(variantId, productHandle, 1);
      toast({ title: "Added to your bag", description: "Your essence awaits checkout." });
      openCart();
    });
  };

  if (variant === "card") {
    return (
      <button
        type="button"
        disabled={pending}
        onClick={handleAdd}
        className={cn(
          "w-full rounded-none bg-primary py-3.5 font-label-caps text-[11px] tracking-[0.12em] text-on-primary uppercase transition-colors hover:bg-primary/90 disabled:opacity-50 font-semibold",
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
      onClick={handleAdd}
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
