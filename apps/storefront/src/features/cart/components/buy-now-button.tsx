"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCartDrawer } from "@/providers/cart-provider";

interface BuyNowButtonProps {
  variantId: string;
  productHandle: string;
}

export function BuyNowButton({ variantId, productHandle }: BuyNowButtonProps) {
  const [pending, startTransition] = useTransition();
  const { buyNowItem } = useCartDrawer();
  const router = useRouter();

  const handleBuyNow = () => {
    startTransition(async () => {
      try {
        await buyNowItem(variantId, productHandle, 1);
        router.push("/checkout");
      } catch (error) {
        console.error("Buy Now error:", error);
        router.push("/checkout");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleBuyNow}
      disabled={pending}
      className="inline-flex items-center justify-center border border-primary text-primary px-8 py-3.5 font-label-caps text-label-caps uppercase tracking-widest hover:bg-surface-container transition-colors rounded-none disabled:opacity-50 font-semibold"
    >
      {pending ? "Preparing..." : "Buy Now"}
    </button>
  );
}
