"use server";

import { cookies } from "next/headers";

const SESSION_COOKIE = "galle_session";

export async function getSessionToken(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value;
}

export async function setSessionToken(token: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getCustomer() {
  const { createMedusaClient, isMedusaConfigured } = await import(
    "@/lib/medusa/client"
  );
  const token = await getSessionToken();
  if (!token || !isMedusaConfigured()) return null;
  try {
    const sdk = createMedusaClient();
    if (!sdk) return null;
    const { customer } = await sdk.store.customer.retrieve(
      {},
      { Authorization: `Bearer ${token}` },
    );
    return customer;
  } catch {
    return null;
  }
}
