"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { createGiftOrder } from "@/features/gifting/server/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/money";
import type { Product } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

interface GiftingFormProps {
  products: Product[];
}

const initialState = null;

export function GiftingForm({ products }: GiftingFormProps) {
  const [state, formAction, pending] = useActionState(createGiftOrder, initialState);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (handle: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(handle)) next.delete(handle);
      else next.add(handle);
      return next;
    });
  };

  return (
    <form action={formAction} className="space-y-10">
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input label="Your name" name="senderName" required />
        <Input label="Your email" name="senderEmail" type="email" required />
        <Input label="Recipient name" name="recipientName" required />
        <Input label="Recipient phone" name="recipientPhone" type="tel" required />
        <Input label="Gift message (optional)" name="message" className="sm:col-span-2" />
      </section>

      <section>
        <h2 className="font-headline-sm text-headline-sm text-primary mb-2">
          Select fragrances
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          Choose one or more perfumes for this gift.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {products.map((p) => {
            const isSelected = selected.has(p.handle);
            return (
              <label
                key={p.id}
                className={cn(
                  "flex flex-col items-center p-4 border border-outline-variant/30 rounded-xl cursor-pointer hover:border-primary transition-colors",
                  isSelected && "border-primary bg-primary-container/20",
                )}
              >
                <input
                  type="checkbox"
                  name="products"
                  value={p.handle}
                  checked={isSelected}
                  onChange={() => toggle(p.handle)}
                  className="sr-only"
                />
                <div className="relative w-20 h-28 mb-3">
                  <Image src={p.thumbnail} alt={p.title} fill className="object-cover rounded" sizes="80px" />
                </div>
                <p className="font-headline-sm text-headline-sm text-primary text-center">{p.title}</p>
                {p.variants[0] && (
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {formatINR(p.variants[0].pricePaise)}
                  </p>
                )}
              </label>
            );
          })}
        </div>
      </section>

      {state && !state.success && (
        <p className="text-error text-sm text-center">{state.error}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={pending || selected.size === 0}
      >
        {pending ? "Adding to bag…" : "Continue to Checkout"}
      </Button>
    </form>
  );
}
