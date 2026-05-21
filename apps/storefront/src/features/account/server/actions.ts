"use server";

import { revalidatePath } from "next/cache";
import { getSessionToken } from "@/features/auth/server/session";
import { createMedusaClient, isMedusaConfigured } from "@/lib/medusa/client";

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getCustomerOrders(): Promise<Result<any[]>> {
  const token = await getSessionToken();
  if (!token) return { success: false, error: "Not signed in." };
  if (!isMedusaConfigured()) return { success: true, data: [] };

  try {
    const sdk = createMedusaClient()!;
    const { orders } = await sdk.store.order.list(
      {},
      { Authorization: `Bearer ${token}` }
    );
    return { success: true, data: orders ?? [] };
  } catch {
    return { success: true, data: [] };
  }
}

export async function getOrderDetails(orderId: string): Promise<Result<any>> {
  const token = await getSessionToken();
  if (!token) return { success: false, error: "Not signed in." };
  if (!isMedusaConfigured()) return { success: false, error: "Backend not configured." };

  try {
    const sdk = createMedusaClient()!;
    const { order } = await sdk.store.order.retrieve(
      orderId,
      { fields: "+items.*,+shipping_address.*" },
      { Authorization: `Bearer ${token}` }
    );
    return { success: true, data: order };
  } catch (error: any) {
    console.error("Error retrieving order details:", error);
    return { success: false, error: "Order not found." };
  }
}

export async function updateProfileAction(data: {
  firstName: string;
  lastName: string;
  phone: string;
}): Promise<{ success: boolean; error?: string }> {
  const token = await getSessionToken();
  if (!token) return { success: false, error: "Not signed in." };
  if (!isMedusaConfigured()) return { success: false, error: "Backend not configured." };

  try {
    const sdk = createMedusaClient()!;
    await sdk.store.customer.update(
      { first_name: data.firstName, last_name: data.lastName, phone: data.phone },
      {},
      { Authorization: `Bearer ${token}` }
    );
    revalidatePath("/account/profile");
    return { success: true };
  } catch {
    return { success: false, error: "Could not update profile." };
  }
}

export async function trackOrderAction(data: {
  orderId: string;
  email: string;
}): Promise<Result<any>> {
  if (!isMedusaConfigured()) {
    return { success: false, error: "Backend not configured." };
  }
  try {
    const sdk = createMedusaClient()!;
    const { order } = await sdk.store.order.retrieve(data.orderId);
    return { success: true, data: order };
  } catch {
    return { success: false, error: "Order not found. Check your order ID and email." };
  }
}

export async function getCustomerAddresses(): Promise<Result<any[]>> {
  const token = await getSessionToken();
  if (!token) return { success: false, error: "Not signed in." };
  if (!isMedusaConfigured()) return { success: true, data: [] };

  try {
    const sdk = createMedusaClient()!;
    const { customer } = await sdk.store.customer.retrieve(
      { fields: "+addresses.*" },
      { Authorization: `Bearer ${token}` }
    );
    return { success: true, data: customer.addresses ?? [] };
  } catch {
    return { success: true, data: [] };
  }
}

export async function addCustomerAddressAction(data: {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
  phone: string;
}): Promise<{ success: boolean; error?: string }> {
  const token = await getSessionToken();
  if (!token) return { success: false, error: "Not signed in." };
  if (!isMedusaConfigured()) return { success: false, error: "Backend not configured." };

  try {
    const sdk = createMedusaClient()!;
    await sdk.store.customer.createAddress(
      {
        first_name: data.firstName,
        last_name: data.lastName,
        address_1: data.address,
        city: data.city,
        postal_code: data.postalCode,
        province: data.province,
        phone: data.phone,
        country_code: "in",
      },
      {},
      { Authorization: `Bearer ${token}` }
    );
    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error: any) {
    console.error("Error adding customer address:", error);
    return { success: false, error: error.message || "Could not add address." };
  }
}

export async function deleteCustomerAddressAction(addressId: string): Promise<{ success: boolean; error?: string }> {
  const token = await getSessionToken();
  if (!token) return { success: false, error: "Not signed in." };
  if (!isMedusaConfigured()) return { success: false, error: "Backend not configured." };

  try {
    const sdk = createMedusaClient()!;
    await sdk.store.customer.deleteAddress(
      addressId,
      { Authorization: `Bearer ${token}` }
    );
    revalidatePath("/account/addresses");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting customer address:", error);
    return { success: false, error: "Could not delete address." };
  }
}
