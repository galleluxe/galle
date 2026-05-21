import { NextResponse } from "next/server";
import { getCart } from "@/features/cart/server/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const cart = await getCart();
  return NextResponse.json(cart);
}
