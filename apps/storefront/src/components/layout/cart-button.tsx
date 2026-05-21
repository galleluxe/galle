"use client";

import { useCartDrawer } from "@/providers/cart-provider";

export function CartButton({ itemCount }: { itemCount: number }) {
  const { open } = useCartDrawer();
  return (
    <button
      type="button"
      onClick={open}
      className="text-outline hover:opacity-70 transition-opacity relative"
      aria-label={`Open bag, ${itemCount} items`}
    >
      <span className="material-symbols-outlined text-2xl">shopping_bag</span>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}
