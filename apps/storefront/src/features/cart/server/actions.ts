"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getProduct } from "@/lib/catalog";
import { createMedusaClient, isMedusaConfigured } from "@/lib/medusa/client";
import { getStoredCart, saveCart, getCart } from "./store";
import { cookies } from "next/headers";

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

const GALLE_CART_ID_COOKIE = "galle_cart_id";

export async function addToCart(input: unknown) {
  const { variantId, productHandle, quantity } = AddSchema.parse(input);

  const product = await getProduct(productHandle);

  if (!product?.variants.some((v) => v.id === variantId)) {
    throw new Error("Invalid variant");
  }

  if (!isMedusaConfigured()) {

    const stored = await getStoredCart();
    const existing = stored.lines.find(
      (l) => l.variantId === variantId && l.productHandle === productHandle
    );

    if (existing) {
      existing.quantity = Math.min(10, existing.quantity + quantity);
    } else {
      stored.lines.push({ variantId, productHandle, quantity });
    }

    await saveCart(stored);
    revalidatePath("/", "layout");
    return;
  }

  try {
    const sdk = createMedusaClient();
    if (!sdk) throw new Error("Could not initialize Medusa client");

    // Ensure cart exists
    const cart = await getCart();
    const cartId = cart.id;

    await sdk.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
    });

    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Error adding to Medusa cart:", error);
    throw error;
  }
}

export async function updateCartLine(input: unknown) {
  const { variantId, productHandle, quantity } = UpdateSchema.parse(input);

  if (!isMedusaConfigured()) {
    const stored = await getStoredCart();

    if (quantity === 0) {
      stored.lines = stored.lines.filter(
        (l) => !(l.variantId === variantId && l.productHandle === productHandle)
      );
    } else {
      const line = stored.lines.find(
        (l) => l.variantId === variantId && l.productHandle === productHandle
      );
      if (line) line.quantity = quantity;
    }

    await saveCart(stored);
    revalidatePath("/", "layout");
    return;
  }

  try {
    const sdk = createMedusaClient();
    if (!sdk) throw new Error("Could not initialize Medusa client");

    const jar = await cookies();
    const cartId = jar.get(GALLE_CART_ID_COOKIE)?.value;
    if (!cartId) throw new Error("Cart not found");

    // Fetch full Medusa cart to find correct line item id
    const { cart } = await sdk.store.cart.retrieve(cartId, {
      fields: "+items.*",
    });

    const item = (cart.items ?? []).find((i: any) => i.variant_id === variantId);
    if (!item) {
      console.warn("Item not found in Medusa cart during update.");
      return;
    }

    if (quantity === 0) {
      await sdk.store.cart.deleteLineItem(cartId, item.id);
    } else {
      await sdk.store.cart.updateLineItem(cartId, item.id, {
        quantity,
      });
    }

    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Error updating Medusa cart line:", error);
    throw error;
  }
}

export async function removeFromCart(variantId: string, productHandle: string) {
  if (!isMedusaConfigured()) {
    const stored = await getStoredCart();
    stored.lines = stored.lines.filter(
      (l) => !(l.variantId === variantId && l.productHandle === productHandle)
    );
    await saveCart(stored);
    revalidatePath("/", "layout");
    return;
  }

  try {
    const sdk = createMedusaClient();
    if (!sdk) throw new Error("Could not initialize Medusa client");

    const jar = await cookies();
    const cartId = jar.get(GALLE_CART_ID_COOKIE)?.value;
    if (!cartId) throw new Error("Cart not found");

    const { cart } = await sdk.store.cart.retrieve(cartId, {
      fields: "+items.*",
    });

    const item = (cart.items ?? []).find((i: any) => i.variant_id === variantId);
    if (item) {
      await sdk.store.cart.deleteLineItem(cartId, item.id);
    }

    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Error removing from Medusa cart:", error);
    throw error;
  }
}
