"use client";

import { useEffect, useState } from "react";
import { useCartDrawer } from "@/providers/cart-provider";

function getCartCountFromCookie(): number {
  if (typeof window === "undefined") return 0;
  const match = document.cookie.match(/(?:^|; )galle_cart_data=([^;]*)/);
  if (!match) return 0;
  try {
    const decoded = decodeURIComponent(match[1]);
    const stored = JSON.parse(decoded) as { lines: { quantity: number }[] };
    return (stored.lines || []).reduce((sum, line) => sum + (line.quantity || 0), 0);
  } catch (e) {
    return 0;
  }
}

export function CartButton() {
  const { open } = useCartDrawer();
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Initial fetch from cookie on mount
    setCount(getCartCountFromCookie());

    const handleUpdate = () => {
      setCount(getCartCountFromCookie());
    };

    window.addEventListener("galle-cart-updated", handleUpdate);
    return () => {
      window.removeEventListener("galle-cart-updated", handleUpdate);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={open}
      className="text-on-surface-variant hover:text-primary transition-colors relative"
      aria-label={`Open bag, ${count} items`}
    >
      <span className="material-symbols-outlined text-2xl">shopping_bag</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
          {count}
        </span>
      )}
    </button>
  );
}
