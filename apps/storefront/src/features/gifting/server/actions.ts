"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getProduct } from "@/lib/catalog";
import { getStoredCart, saveCart } from "@/features/cart/server/store";

const GiftSchema = z.object({
  senderName: z.string().min(1),
  senderEmail: z.string().email(),
  recipientName: z.string().min(1),
  recipientPhone: z.string().min(6),
  message: z.string().optional(),
  productHandles: z.array(z.string().min(1)).min(1),
});

type GiftResult = { success: false; error: string } | { success: true };

export async function createGiftOrder(
  _prevState: GiftResult | null,
  formData: FormData,
): Promise<GiftResult> {
  const raw = {
    senderName: formData.get("senderName"),
    senderEmail: formData.get("senderEmail"),
    recipientName: formData.get("recipientName"),
    recipientPhone: formData.get("recipientPhone"),
    message: formData.get("message"),
    productHandles: formData.getAll("products").map(String).filter(Boolean),
  };

  const parsed = GiftSchema.safeParse(raw);
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0];
    return {
      success: false,
      error:
        field === "productHandles"
          ? "Please select at least one fragrance."
          : "Please fill in all required fields.",
    };
  }

  const {
    productHandles,
    senderName,
    senderEmail,
    recipientName,
    recipientPhone,
    message,
  } = parsed.data;

  const giftMeta = {
    isGift: true,
    senderName,
    senderEmail,
    recipientName,
    recipientPhone,
    message: message ?? "",
  };

  const stored = await getStoredCart();

  for (const productHandle of productHandles) {
    const product = await getProduct(productHandle);
    if (!product || !product.variants[0]) {
      return {
        success: false,
        error: `"${productHandle}" is unavailable.`,
      };
    }

    const variantId = product.variants[0].id;
    const existing = stored.lines.find(
      (l) => l.variantId === variantId && l.productHandle === productHandle,
    );

    if (existing) {
      existing.quantity = Math.min(10, existing.quantity + 1);
      existing.giftMeta = giftMeta;
    } else {
      stored.lines.push({
        variantId,
        productHandle,
        quantity: 1,
        giftMeta,
      });
    }
  }

  await saveCart(stored);
  revalidatePath("/", "layout");
  redirect("/checkout");
}
