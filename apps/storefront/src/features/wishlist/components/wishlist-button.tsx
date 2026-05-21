"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  isWishlisted,
  toggleWishlistHandle,
  WISHLIST_CHANGE_EVENT,
} from "@/lib/wishlist/storage";

interface WishlistButtonProps {
  productHandle: string;
  className?: string;
}

export function WishlistButton({
  productHandle,
  className,
}: WishlistButtonProps) {
  const [saved, setSaved] = useState(false);

  const sync = useCallback(() => {
    setSaved(isWishlisted(productHandle));
  }, [productHandle]);

  useEffect(() => {
    sync();
    window.addEventListener(WISHLIST_CHANGE_EVENT, sync);
    return () => window.removeEventListener(WISHLIST_CHANGE_EVENT, sync);
  }, [sync]);

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlistHandle(productHandle);
        sync();
      }}
      className={cn(
        "z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-lowest/90 backdrop-blur-sm transition-colors hover:bg-surface-container-low",
        className,
      )}
    >
      <span
        className={cn(
          "material-symbols-outlined text-[22px] leading-none transition-colors",
          saved ? "text-primary" : "text-outline",
        )}
        style={
          saved
            ? { fontVariationSettings: "'FILL' 1, 'wght' 300" }
            : undefined
        }
      >
        favorite
      </span>
    </button>
  );
}
