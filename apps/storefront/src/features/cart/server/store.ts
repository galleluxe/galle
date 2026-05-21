import { cookies } from "next/headers";
import { getProduct, listProducts } from "@/lib/catalog";
import { createMedusaClient, isMedusaConfigured } from "@/lib/medusa/client";
import type { Cart, CartLine } from "@/lib/catalog/types";

const CART_DATA_COOKIE = "galle_cart_data";
const GALLE_CART_ID_COOKIE = "galle_cart_id";

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
    0
  );

  return { id, lines, itemCount, subtotalPaise };
}

// ----------------------------------------------------
// Medusa Cart Helpers
// ----------------------------------------------------

async function createMedusaCart(): Promise<any> {
  const sdk = createMedusaClient();
  if (!sdk) return null;

  try {
    // List regions to get first valid region
    const { regions } = await sdk.store.region.list();
    const regionId = regions?.[0]?.id;

    const { cart } = await sdk.store.cart.create({
      region_id: regionId,
      currency_code: "inr",
    });

    if (cart) {
      const jar = await cookies();
      jar.set(GALLE_CART_ID_COOKIE, cart.id, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 60,
      });
    }

    return cart;
  } catch (error) {
    console.error("Error creating Medusa cart:", error);
    return null;
  }
}

async function fetchMedusaCart(cartId: string): Promise<any> {
  const sdk = createMedusaClient();
  if (!sdk) return null;

  try {
    const { cart } = await sdk.store.cart.retrieve(cartId, {
      fields: "+items.*,+items.variant.*",
    });
    return cart;
  } catch (error) {
    console.error("Error retrieving Medusa cart:", error);
    return null;
  }
}

export async function getCart(): Promise<Cart> {
  const jar = await cookies();
  const cartId = jar.get(GALLE_CART_ID_COOKIE)?.value;

  if (!isMedusaConfigured()) {
    const stored = parseCart(jar.get(CART_DATA_COOKIE)?.value);
    return buildCartFromStored(cartId ?? "guest", stored);
  }

  try {
    let medusaCart: any = null;
    if (cartId) {
      medusaCart = await fetchMedusaCart(cartId);
    }

    if (!medusaCart) {
      medusaCart = await createMedusaCart();
    }

    if (!medusaCart) {
      // Fallback if Medusa is configured but server error
      const stored = parseCart(jar.get(CART_DATA_COOKIE)?.value);
      return buildCartFromStored("fallback", stored);
    }

    const catalog = await listProducts();

    const lines: CartLine[] = (medusaCart.items ?? []).map((item: any) => {
      const product =
        catalog.find((p) => p.variants.some((v) => v.id === item.variant_id)) ??
        catalog.find(
          (p) => p.title.toLowerCase() === String(item.title ?? "").toLowerCase(),
        );

      const variant = product?.variants.find((v) => v.id === item.variant_id);
      const unitFromLine = Number(item.unit_price ?? 0);
      const unitPricePaise = variant
        ? variant.pricePaise
        : unitFromLine >= 10000
          ? Math.round(unitFromLine)
          : Math.round(unitFromLine * 100);

      return {
        id: item.id,
        variantId: item.variant_id,
        productHandle: product?.handle ?? String(item.product_handle ?? ""),
        title: product?.title ?? item.title ?? "Perfume",
        thumbnail: product?.thumbnail ?? item.thumbnail ?? "",
        quantity: item.quantity,
        unitPricePaise,
      };
    });

    const itemCount = lines.reduce((s, l) => s + l.quantity, 0);
    const subtotalPaise =
      lines.reduce((s, l) => s + l.quantity * l.unitPricePaise, 0) ||
      Math.round(Number(medusaCart.subtotal ?? 0) * 100);

    return {
      id: medusaCart.id,
      lines,
      itemCount,
      subtotalPaise,
    };
  } catch (error) {
    console.error("Error in getCart from Medusa:", error);
    const stored = parseCart(jar.get(CART_DATA_COOKIE)?.value);
    return buildCartFromStored(cartId ?? "fallback", stored);
  }
}

export async function saveCart(stored: StoredCart): Promise<void> {
  const jar = await cookies();
  jar.set(CART_DATA_COOKIE, JSON.stringify(stored), {
    httpOnly: true,
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
