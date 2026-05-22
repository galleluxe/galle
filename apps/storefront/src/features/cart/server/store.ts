import { cookies } from "next/headers";
import { getProduct } from "@/lib/catalog";
import type { Cart, CartLine } from "@/lib/catalog/types";

export const CART_DATA_COOKIE = "galle_cart_data";

export interface StoredLine {
  variantId: string;
  productHandle: string;
  quantity: number;
  giftMeta?: {
    isGift: boolean;
    senderName: string;
    senderEmail: string;
    recipientName: string;
    recipientPhone: string;
    message: string;
  };
}

interface StoredCart {
  lines: StoredLine[];
}

function parseCart(raw: string | undefined): StoredCart {
  if (!raw) return { lines: [] };
  try {
    return JSON.parse(raw) as StoredCart;
  } catch {
    return { lines: [] };
  }
}

async function buildCartFromStored(id: string, stored: StoredCart): Promise<Cart> {
  const lines: CartLine[] = [];

  for (const line of stored.lines) {
    const product = await getProduct(line.productHandle);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    if (!product || !variant) continue;
    lines.push({
      id: `${line.variantId}-${line.productHandle}`,
      variantId: line.variantId,
      productHandle: line.productHandle,
      title: product.title,
      thumbnail: product.thumbnail,
      quantity: line.quantity,
      unitPricePaise: variant.pricePaise,
    });
  }

  const itemCount = lines.reduce((s, l) => s + l.quantity, 0);
  const subtotalPaise = lines.reduce(
    (s, l) => s + l.quantity * l.unitPricePaise,
    0,
  );

  return { id, lines, itemCount, subtotalPaise };
}

export async function getCart(): Promise<Cart> {
  const jar = await cookies();
  const cartId = jar.get("galle_cart_id")?.value ?? "guest";
  const stored = parseCart(jar.get(CART_DATA_COOKIE)?.value);
  return buildCartFromStored(cartId, stored);
}

export async function saveCart(stored: StoredCart): Promise<void> {
  const jar = await cookies();
  jar.set(CART_DATA_COOKIE, JSON.stringify(stored), {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 60,
  });
}

export async function getStoredCart(): Promise<StoredCart> {
  const jar = await cookies();
  return parseCart(jar.get(CART_DATA_COOKIE)?.value);
}
