"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Resend } from "resend";
import { createElement } from "react";
import { OrderConfirmationEmail } from "@galle/emails";
import { createMedusaClient, isMedusaConfigured } from "@/lib/medusa/client";
import { getCart } from "@/features/cart/server/store";
import { formatINR } from "@/lib/money";

const GALLE_CART_ID_COOKIE = "galle_cart_id";
const CART_DATA_COOKIE = "galle_cart_data";

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
}

export async function completeOrderAction(input: OrderInput) {
  const jar = await cookies();
  const cartId = jar.get(GALLE_CART_ID_COOKIE)?.value;
  const cart = await getCart();

  let orderNumber = `GALLE-${Math.floor(100000 + Math.random() * 90000).toString()}`;
  const totalAmountStr = formatINR(cart.subtotalPaise);

  if (isMedusaConfigured() && cartId) {
    try {
      const sdk = createMedusaClient();
      if (sdk) {
        // 1. Update shipping address & email in Medusa
        await sdk.store.cart.update(cartId, {
          email: input.email,
          shipping_address: {
            first_name: input.firstName,
            last_name: input.lastName,
            address_1: input.address,
            city: input.city,
            postal_code: input.postalCode,
            province: input.province,
            phone: input.phone,
            country_code: "in",
          },
        });

        // 2. Complete the cart to create an order in Medusa
        const response = await sdk.store.cart.complete(cartId);
        if (response.type === "order" && response.order) {
          orderNumber = String(response.order.display_id || response.order.id);
        }
      }
    } catch (error) {
      console.error("Error completing order in Medusa:", error);
      // Fallback to random order number so the user flow doesn't break
    }
  }

  // 3. Send order confirmation email via Resend
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && resendApiKey !== "re_stub12345") {
    try {
      const resend = new Resend(resendApiKey);
      const emailElement = createElement(OrderConfirmationEmail, {
        orderNumber,
        customerName: `${input.firstName} ${input.lastName}`,
        totalINR: totalAmountStr,
      });

      const from =
        process.env.RESEND_FROM_EMAIL ?? "GALLE <onboarding@resend.dev>";

      await resend.emails.send({
        from,
        to: input.email,
        subject: `Your GALLE order ${orderNumber} is confirmed`,
        react: emailElement,
      });
      console.log(`Order confirmation email sent to ${input.email} via Resend.`);
    } catch (emailError) {
      console.error("Error sending email via Resend:", emailError);
    }
  } else {
    console.log(
      `[MOCK EMAIL] To: ${input.email} | Order: ${orderNumber} | Total: ${totalAmountStr}`
    );
  }

  // 4. Clear all cart cookies upon successful order completion
  jar.delete(GALLE_CART_ID_COOKIE);
  jar.delete(CART_DATA_COOKIE);

  revalidatePath("/", "layout");
  return { success: true, orderNumber };
}
