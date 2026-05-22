import { NextResponse } from "next/server";
import { getCart, saveCart, getStoredCart } from "@/features/cart/server/store";
import { getProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const cart = await getCart();
  return NextResponse.json(cart);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, variantId, productHandle, quantity } = body;

    const stored = await getStoredCart();

    if (action === "add") {
      const product = await getProduct(productHandle);
      if (!product?.variants.some((v) => v.id === variantId)) {
        return NextResponse.json({ error: "Invalid variant" }, { status: 400 });
      }

      const existing = stored.lines.find(
        (l) => l.variantId === variantId && l.productHandle === productHandle,
      );

      if (existing) {
        existing.quantity = Math.min(10, existing.quantity + (quantity || 1));
      } else {
        stored.lines.push({ variantId, productHandle, quantity: quantity || 1 });
      }
    } else if (action === "update") {
      if (quantity === 0) {
        stored.lines = stored.lines.filter(
          (l) => !(l.variantId === variantId && l.productHandle === productHandle),
        );
      } else {
        const line = stored.lines.find(
          (l) => l.variantId === variantId && l.productHandle === productHandle,
        );
        if (line) line.quantity = Math.min(10, Math.max(1, quantity));
      }
    } else if (action === "remove") {
      stored.lines = stored.lines.filter(
        (l) => !(l.variantId === variantId && l.productHandle === productHandle),
      );
    }

    await saveCart(stored);
    const updatedCart = await getCart();
    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error("Cart API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
