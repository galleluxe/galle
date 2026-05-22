"use client";

import { useCartDrawer } from "@/providers/cart-provider";

export function CartButton() {
  const { open, cart } = useCartDrawer();
  const count = cart?.itemCount ?? 0;

  return (
    <button
      type="button"
      onClick={open}
      className="text-on-surface-variant hover:text-primary transition-colors relative"
      aria-label={`Open bag, ${count} items`}
    >
      <span className="material-symbols-outlined text-2xl">shopping_bag</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] w-4 h-4 rounded-none flex items-center justify-center font-bold">
          {count}
        </span>
      )}
    </button>
  );
}
