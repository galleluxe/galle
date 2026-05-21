"use server";

import { redirect } from "next/navigation";
import { createMedusaClient, isMedusaConfigured } from "@/lib/medusa/client";
import { clearSession, setSessionToken } from "./session";

type AuthResult =
  | { success: true }
  | { success: false; error: string };

export async function signInAction(data: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  if (!isMedusaConfigured()) {
    return {
      success: false,
      error: "Store backend is not configured. Please check back later.",
    };
  }

  try {
    const sdk = createMedusaClient()!;
    const token = await sdk.auth.login("customer", "emailpass", {
      email: data.email,
      password: data.password,
    });

    if (typeof token !== "string") {
      return { success: false, error: "Invalid credentials." };
    }

    await setSessionToken(token);
    return { success: true };
  } catch {
    return { success: false, error: "Invalid email or password." };
  }
}

export async function signUpAction(data: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<AuthResult> {
  if (!isMedusaConfigured()) {
    return {
      success: false,
      error: "Store backend is not configured. Please check back later.",
    };
  }

  try {
    const sdk = createMedusaClient()!;

    await sdk.auth.register("customer", "emailpass", {
      email: data.email,
      password: data.password,
    });

    const token = await sdk.auth.login("customer", "emailpass", {
      email: data.email,
      password: data.password,
    });

    if (typeof token !== "string") {
      return { success: false, error: "Registration succeeded. Please sign in." };
    }

    const localPart = data.email.split("@")[0] ?? "Guest";
    await sdk.store.customer.create(
      {
        email: data.email,
        first_name: data.firstName?.trim() || localPart,
        last_name: data.lastName?.trim() || "",
      },
      {},
      { Authorization: `Bearer ${token}` },
    );

    await setSessionToken(token);
    return { success: true };
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Registration failed. Please try again.";
    return { success: false, error: msg };
  }
}

export async function signOutAction() {
  const { createMedusaClient: create, isMedusaConfigured: configured } =
    await import("@/lib/medusa/client");
  if (configured()) {
    try {
      const { getSessionToken } = await import("./session");
      const token = await getSessionToken();
      if (token) {
        const sdk = create();
        await sdk?.auth.logout();
      }
    } catch {
      // ignore
    }
  }
  await clearSession();
  redirect("/");
}

export async function forgotPasswordAction(data: {
  email: string;
}): Promise<AuthResult> {
  if (!isMedusaConfigured()) {
    return { success: false, error: "Backend not configured." };
  }
  try {
    const sdk = createMedusaClient()!;
    await sdk.auth.resetPassword("customer", "emailpass", { identifier: data.email });
    return { success: true };
  } catch {
    return { success: false, error: "Could not send reset email." };
  }
}

export async function resetPasswordAction(data: {
  token: string;
  password: string;
}): Promise<AuthResult> {
  if (!isMedusaConfigured()) {
    return { success: false, error: "Backend not configured." };
  }
  try {
    const sdk = createMedusaClient()!;
    // Medusa v2: set password via token header
    await sdk.client.fetch("/auth/customer/emailpass/update", {
      method: "POST",
      headers: { Authorization: `Bearer ${data.token}` },
      body: { password: data.password },
    });
    return { success: true };
  } catch {
    return { success: false, error: "Invalid or expired token." };
  }
}
