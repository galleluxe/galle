"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getProduct } from "@/lib/catalog";
import { getStoredCart, saveCart } from "./store";

const AddSchema = z.object({
  variantId: z.string(),
  productHandle: z.string(),
  quantity: z.number().int().min(1).max(10),
});

const UpdateSchema = z.object({
  variantId: z.string(),
  productHandle: z.string(),
  quantity: z.number().int().min(0).max(10),
});

export async function addToCart(input: unknown) {
  const { variantId, productHandle, quantity } = AddSchema.parse(input);
  const product = await getProduct(productHandle);

  if (!product?.variants.some((v) => v.id === variantId)) {
    throw new Error("Invalid variant");
  }

  const stored = await getStoredCart();
  const existing = stored.lines.find(
    (l) => l.variantId === variantId && l.productHandle === productHandle,
  );

  if (existing) {
    existing.quantity = Math.min(10, existing.quantity + quantity);
  } else {
    stored.lines.push({ variantId, productHandle, quantity });
  }

  await saveCart(stored);
  revalidatePath("/", "layout");
}

export async function updateCartLine(input: unknown) {
  const { variantId, productHandle, quantity } = UpdateSchema.parse(input);
  const stored = await getStoredCart();

  if (quantity === 0) {
    stored.lines = stored.lines.filter(
      (l) => !(l.variantId === variantId && l.productHandle === productHandle),
    );
  } else {
    const line = stored.lines.find(
      (l) => l.variantId === variantId && l.productHandle === productHandle,
    );
    if (line) line.quantity = quantity;
  }

  await saveCart(stored);
  revalidatePath("/", "layout");
}

export async function removeFromCart(variantId: string, productHandle: string) {
  const stored = await getStoredCart();
  stored.lines = stored.lines.filter(
    (l) => !(l.variantId === variantId && l.productHandle === productHandle),
  );
  await saveCart(stored);
  revalidatePath("/", "layout");
}
