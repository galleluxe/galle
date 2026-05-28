"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createElement } from "react";
import { OrderConfirmationEmail } from "@galle/emails";
import { getResendFromAddress, sendResendEmail } from "@/lib/email/resend";
import { createShiprocketOrder, paiseToRupees } from "@/lib/shiprocket/server";
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
  try {
    const stored = await getStoredCart();
    const resolved = await resolveCartLines(stored.lines);

    if (resolved.subtotalPaise < 100) {
      return { error: "Cart is empty or total is too low." };
    }

    const orderNumber = `GALLE-${Math.floor(100000 + Math.random() * 900000)}`;
    const razorpayOrder = await createRazorpayOrder(
      resolved.subtotalPaise,
      orderNumber,
    );

    return {
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amountPaise: resolved.subtotalPaise,
      orderNumber,
      basePaise: resolved.basePaise,
      gstPaise: resolved.gstPaise,
    };
  } catch (err) {
    console.error("prepareCheckoutAction failed:", err);
    return {
      error: err instanceof Error ? err.message : "Failed to prepare Razorpay order.",
    };
  }
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

  const totalAmountStr = formatINR(resolved.subtotalPaise);

  const emailResult = await sendResendEmail({
    to: input.email,
    subject: `Your GALLE order ${orderNumber} is confirmed`,
    react: createElement(OrderConfirmationEmail, {
      orderNumber,
      customerName: `${input.firstName} ${input.lastName}`,
      totalINR: totalAmountStr,
    }),
  });

  if (!emailResult.ok && !emailResult.skipped) {
    console.error(
      `[checkout] Order ${orderNumber} saved but confirmation email failed for ${input.email} (from ${getResendFromAddress()}):`,
      emailResult.error,
    );
  }

  const notifyTo = process.env.RESEND_ORDER_NOTIFY_EMAIL?.trim();
  if (notifyTo) {
    await sendResendEmail({
      to: notifyTo,
      subject: `[GALLE] New order ${orderNumber}`,
      text: `Order ${orderNumber}\nCustomer: ${input.firstName} ${input.lastName}\nEmail: ${input.email}\nTotal: ${totalAmountStr}`,
    });
  }

  // Push order to Shiprocket (non-blocking — failure does NOT stop checkout)
  const orderDate = new Date()
    .toISOString()
    .slice(0, 16)
    .replace("T", " ");

  void createShiprocketOrder({
    orderNumber,
    orderDate,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    address: input.address,
    city: input.city,
    postalCode: input.postalCode,
    state: input.province,
    subtotalRupees: paiseToRupees(resolved.subtotalPaise),
    items: resolved.lines.map((line) => ({
      name: `${line.productTitle} - ${line.variantTitle}`,
      sku: line.sku,
      units: line.quantity,
      selling_price: paiseToRupees(line.unitPricePaise),
    })),
  });

  jar.delete(CART_DATA_COOKIE);
  revalidatePath("/", "layout");

  return { success: true, orderNumber };
}
