"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getProduct } from "@/lib/catalog";
import { getStoredCart, saveCart, getCart } from "@/features/cart/server/store";
import { createMedusaClient, isMedusaConfigured } from "@/lib/medusa/client";
import type { StoredLine } from "@/features/cart/server/store";

const GiftSchema = z.object({
  senderName: z.string().min(1),
  senderEmail: z.string().email(),
  recipientName: z.string().min(1),
  recipientPhone: z.string().min(6),
  message: z.string().optional(),
  productHandle: z.string().min(1),
});

type GiftResult = { success: false; error: string } | { success: true };

export async function createGiftOrder(
  _prevState: GiftResult | null,
  formData: FormData
): Promise<GiftResult> {
  const raw = {
    senderName: formData.get("senderName"),
    senderEmail: formData.get("senderEmail"),
    recipientName: formData.get("recipientName"),
    recipientPhone: formData.get("recipientPhone"),
    message: formData.get("message"),
    productHandle: formData.get("product"),
  };

  const parsed = GiftSchema.safeParse(raw);
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0];
    return {
      success: false,
      error: field === "productHandle"
        ? "Please select a fragrance."
        : `Please fill in all required fields.`,
    };
  }

  const { productHandle, senderName, senderEmail, recipientName, recipientPhone, message } =
    parsed.data;

  const product = await getProduct(productHandle);
  if (!product || !product.variants[0]) {
    return { success: false, error: "Selected product is unavailable." };
  }

  const giftMeta = {
    isGift: true,
    senderName,
    senderEmail,
    recipientName,
    recipientPhone,
    message: message ?? "",
  };

  if (!isMedusaConfigured()) {
    const stored = await getStoredCart();
    const existing = stored.lines.find(
      (l) => l.variantId === product.variants[0].id && l.productHandle === productHandle
    );

    if (existing) {
      existing.quantity = Math.min(10, existing.quantity + 1);
      existing.giftMeta = giftMeta;
    } else {
      stored.lines.push({
        variantId: product.variants[0].id,
        productHandle,
        quantity: 1,
        giftMeta,
      });
    }

    await saveCart(stored);
  } else {
    try {
      const sdk = createMedusaClient();
      if (!sdk) throw new Error("Could not initialize Medusa client");

      // Resolve or create cart
      const cart = await getCart();
      const cartId = cart.id;

      // Add line item with gifting metadata to Medusa
      await sdk.store.cart.createLineItem(cartId, {
        variant_id: product.variants[0].id,
        quantity: 1,
        metadata: giftMeta,
      });
    } catch (error: any) {
      console.error("Error creating gift order in Medusa:", error);
      return { success: false, error: "Failed to process gift order." };
    }
  }

  revalidatePath("/", "layout");
  redirect("/checkout");
}
