"use server";

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
  display_id?: number;
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

export async function getOrderDetails(_id: string): Promise<OrderDetailsResult> {
  void _id;
  return { success: false as const, error: MSG };
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

export async function trackOrderAction(_input: {
  orderId: string;
  email: string;
}): Promise<TrackOrderResult> {
  void _input;
  return { success: false as const, error: "Order tracking is not available yet." };
}
