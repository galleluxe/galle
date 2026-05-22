"use client";

import { createContext, useCallback, useContext, useState, useEffect } from "react";
import type { Cart } from "@/lib/catalog/types";

interface CartDrawerCtx {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  cart: Cart | null;
  loading: boolean;
  addCartItem: (variantId: string, productHandle: string, quantity?: number) => Promise<void>;
  updateCartItem: (variantId: string, productHandle: string, quantity: number) => Promise<void>;
  removeCartItem: (variantId: string, productHandle: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartDrawerContext = createContext<CartDrawerCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (e) {
      console.error("Failed to load cart:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addCartItem = useCallback(async (variantId: string, productHandle: string, quantity: number = 1) => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", variantId, productHandle, quantity }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCart(updated);
        // Dispatch event for any legacy listeners
        window.dispatchEvent(new Event("galle-cart-updated"));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCartItem = useCallback(async (variantId: string, productHandle: string, quantity: number) => {
    // Optimistic UI update for instant cart reaction
    setCart((prev) => {
      if (!prev) return null;
      const updatedLines = prev.lines.map((line) => {
        if (line.variantId === variantId && line.productHandle === productHandle) {
          return { ...line, quantity };
        }
        return line;
      }).filter((line) => line.quantity > 0);

      const itemCount = updatedLines.reduce((sum, l) => sum + l.quantity, 0);
      const subtotalPaise = updatedLines.reduce((sum, l) => sum + l.quantity * l.unitPricePaise, 0);

      return { ...prev, lines: updatedLines, itemCount, subtotalPaise };
    });

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", variantId, productHandle, quantity }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCart(updated);
        window.dispatchEvent(new Event("galle-cart-updated"));
      }
    } catch (e) {
      console.error(e);
      refreshCart(); // rollback on error
    }
  }, [refreshCart]);

  const removeCartItem = useCallback(async (variantId: string, productHandle: string) => {
    // Optimistic UI update
    setCart((prev) => {
      if (!prev) return null;
      const updatedLines = prev.lines.filter(
        (line) => !(line.variantId === variantId && line.productHandle === productHandle)
      );
      const itemCount = updatedLines.reduce((sum, l) => sum + l.quantity, 0);
      const subtotalPaise = updatedLines.reduce((sum, l) => sum + l.quantity * l.unitPricePaise, 0);

      return { ...prev, lines: updatedLines, itemCount, subtotalPaise };
    });

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", variantId, productHandle }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCart(updated);
        window.dispatchEvent(new Event("galle-cart-updated"));
      }
    } catch (e) {
      console.error(e);
      refreshCart();
    }
  }, [refreshCart]);

  return (
    <CartDrawerContext.Provider value={{ isOpen, open, close, cart, loading, addCartItem, updateCartItem, removeCartItem, refreshCart }}>
      {children}
    </CartDrawerContext.Provider>
  );
}

export function useCartDrawer(): CartDrawerCtx {
  const ctx = useContext(CartDrawerContext);
  if (!ctx) throw new Error("useCartDrawer must be used inside CartProvider");
  return ctx;
}
