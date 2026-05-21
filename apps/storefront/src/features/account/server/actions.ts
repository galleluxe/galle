"use server";

import { getPayloadClient } from "@/lib/payload";

const MSG = "Customer accounts are not enabled yet.";

export type CustomerAddress = {
  id: string;
  first_name: string;
  last_name: string;
  address_1: string;
  city: string;
  province: string;
  postal_code: string;
  phone: string;
};

export type OrderDetails = {
  id: string;
  display_id?: string;
  created_at?: string;
  status?: string;
  fulfillment_status?: string;
  items?: Array<{
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
  }>;
  subtotal?: number;
  shipping_total?: number;
  tax_total?: number;
  total?: number;
  shipping_address?: {
    first_name?: string;
    last_name?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    phone?: string;
  };
};

export type OrderDetailsResult =
  | { success: true; data: OrderDetails }
  | { success: false; error: string };

export async function getCustomerOrders() {
  return { success: true as const, data: [] as Record<string, unknown>[] };
}

export async function getOrderDetails(id: string): Promise<OrderDetailsResult> {
  try {
    const payload = await getPayloadClient();
    const order = await payload.findByID({
      collection: "orders",
      id,
    });

    if (!order) {
      return { success: false as const, error: "Order not found." };
    }

    // Map order fields to OrderDetails type
    const lines = Array.isArray(order.lines) ? order.lines : [];
    const items = lines.map((line: any, idx: number) => ({
      id: line.variantId || String(idx),
      title: `${line.productTitle || "Fragrance"} - ${line.variantTitle || ""}`,
      quantity: Number(line.quantity || 1),
      unit_price: Number(line.unitPricePaise || 0),
    }));

    const addr = order.shippingAddress as Record<string, any> || {};

    return {
      success: true as const,
      data: {
        id: String(order.id),
        display_id: order.orderNumber,
        created_at: order.createdAt,
        status: order.status,
        fulfillment_status: "Paid & Processing",
        items,
        subtotal: Number(order.basePaise || 0),
        shipping_total: 0,
        tax_total: Number(order.gstPaise || 0),
        total: Number(order.totalPaise || 0),
        shipping_address: {
          first_name: addr.firstName,
          last_name: addr.lastName,
          address_1: addr.address,
          city: addr.city,
          province: addr.province,
          postal_code: addr.postalCode,
          phone: addr.phone,
        },
      },
    };
  } catch (error) {
    console.error("Error retrieving order:", error);
    return { success: false as const, error: "Error retrieving order details." };
  }
}

export async function updateProfileAction(_data: unknown) {
  return { success: false as const, error: MSG };
}

export async function getCustomerAddresses() {
  return { success: true as const, data: [] as CustomerAddress[] };
}

export async function addCustomerAddressAction(_data: unknown) {
  return { success: false as const, error: MSG };
}

export async function deleteCustomerAddressAction(_id: string) {
  return { success: false as const, error: MSG };
}

export type TrackOrderResult =
  | { success: true; data: Record<string, unknown> }
  | { success: false; error: string };

export async function trackOrderAction(input: {
  orderId: string;
  email: string;
}): Promise<TrackOrderResult> {
  try {
    const payload = await getPayloadClient();
    const cleanOrderId = input.orderId.trim();
    const cleanEmail = input.email.trim().toLowerCase();

    const result = await payload.find({
      collection: "orders",
      where: {
        and: [
          {
            or: [
              { orderNumber: { equals: cleanOrderId } },
              { id: { equals: cleanOrderId } },
            ],
          },
          {
            email: { equals: cleanEmail },
          },
        ],
      },
    });

    if (result.docs.length === 0) {
      return { success: false, error: "No matching order found. Please check your Order ID and email address." };
    }

    const order = result.docs[0];
    const lines = Array.isArray(order.lines) ? order.lines : [];
    const items = lines.map((line: any, idx: number) => ({
      id: line.variantId || String(idx),
      title: `${line.productTitle || "Fragrance"} - ${line.variantTitle || ""}`,
      quantity: Number(line.quantity || 1),
      unit_price: Number(line.unitPricePaise || 0),
    }));

    const addr = order.shippingAddress as Record<string, any> || {};

    return {
      success: true,
      data: {
        id: String(order.id),
        display_id: order.orderNumber,
        created_at: order.createdAt,
        status: order.status,
        fulfillment_status: "Paid & Processing",
        items,
        subtotal: Number(order.basePaise || 0),
        shipping_total: 0,
        tax_total: Number(order.gstPaise || 0),
        total: Number(order.totalPaise || 0),
        shipping_address: {
          first_name: addr.firstName,
          last_name: addr.lastName,
          address_1: addr.address,
          city: addr.city,
          province: addr.province,
          postal_code: addr.postalCode,
          phone: addr.phone,
        },
      },
    };
  } catch (error) {
    console.error("Order tracking error:", error);
    return { success: false, error: "An error occurred while tracking order. Please try again." };
  }
}
