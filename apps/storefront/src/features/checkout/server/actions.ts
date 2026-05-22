"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { createElement } from "react";
import { OrderConfirmationEmail } from "@galle/emails";
import { CART_DATA_COOKIE, getStoredCart } from "@/features/cart/server/store";
import { resolveCartLines } from "@/lib/checkout/resolve-cart";
import { createRazorpayOrder } from "@/lib/razorpay/server";
import { getPayloadClient } from "@/lib/payload";
import { formatINR } from "@/lib/money";

interface OrderInput {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  isGift?: boolean;
  giftMessage?: string;
}

export async function prepareCheckoutAction() {
  const stored = await getStoredCart();
  const resolved = await resolveCartLines(stored.lines);

  if (resolved.subtotalPaise < 100) {
    throw new Error("Cart is empty or total is too low.");
  }

  const orderNumber = `GALLE-${Math.floor(100000 + Math.random() * 900000)}`;
  const razorpayOrder = await createRazorpayOrder(
    resolved.subtotalPaise,
    orderNumber,
  );

  return {
    razorpayOrderId: razorpayOrder.id,
    amountPaise: resolved.subtotalPaise,
    orderNumber,
    basePaise: resolved.basePaise,
    gstPaise: resolved.gstPaise,
  };
}

export async function completeOrderAction(input: OrderInput) {
  const jar = await cookies();
  const stored = await getStoredCart();
  const resolved = await resolveCartLines(stored.lines);

  if (resolved.subtotalPaise < 100) {
    throw new Error("Cart is empty.");
  }

  const orderNumber = `GALLE-${Math.floor(100000 + Math.random() * 900000)}`;

  const payload = await getPayloadClient();

  for (const line of resolved.lines) {
    const variant = await payload.findByID({
      collection: "product-variants",
      id: line.variantId,
    });
    await payload.update({
      collection: "product-variants",
      id: line.variantId,
      data: {
        inventory: Math.max(0, Number(variant.inventory) - line.quantity),
      },
    });
  }

  await payload.create({
    collection: "orders",
    data: {
      orderNumber,
      email: input.email,
      status: "paid",
      totalPaise: resolved.subtotalPaise,
      basePaise: resolved.basePaise,
      gstPaise: resolved.gstPaise,
      razorpayPaymentId: input.razorpayPaymentId,
      razorpayOrderId: input.razorpayOrderId,
      lines: resolved.lines,
      isGift: input.isGift ?? false,
      giftMessage: input.giftMessage ?? "",
      shippingAddress: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        address: input.address,
        city: input.city,
        postalCode: input.postalCode,
        province: input.province,
        country: "IN",
      },
    },
  });

  const resendApiKey = process.env.RESEND_API_KEY;
  const totalAmountStr = formatINR(resolved.subtotalPaise);

  if (resendApiKey && resendApiKey !== "re_stub12345") {
    try {
      const resend = new Resend(resendApiKey);
      const from =
        process.env.RESEND_FROM_EMAIL ?? "GALLE <onboarding@resend.dev>";

      await resend.emails.send({
        from,
        to: input.email,
        subject: `Your GALLE order ${orderNumber} is confirmed`,
        react: createElement(OrderConfirmationEmail, {
          orderNumber,
          customerName: `${input.firstName} ${input.lastName}`,
          totalINR: totalAmountStr,
        }),
      });
    } catch (emailError) {
      console.error("Error sending email via Resend:", emailError);
    }
  }

  jar.delete(CART_DATA_COOKIE);
  revalidatePath("/", "layout");

  return { success: true, orderNumber };
}
