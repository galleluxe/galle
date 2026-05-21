"use server";

import { redirect } from "next/navigation";
import { clearSession } from "./session";

type AuthResult = { success: true } | { success: false; error: string };

const AUTH_MSG =
  "Customer accounts are not enabled yet. Checkout as a guest.";

export async function signInAction(_data: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  return { success: false, error: AUTH_MSG };
}

export async function signUpAction(_data: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<AuthResult> {
  return { success: false, error: AUTH_MSG };
}

export async function signOutAction() {
  await clearSession();
  redirect("/");
}

export async function forgotPasswordAction(_data: {
  email: string;
}): Promise<AuthResult> {
  void _data;
  return { success: false, error: AUTH_MSG };
}

export async function resetPasswordAction(_data: {
  token: string;
  password: string;
}): Promise<AuthResult> {
  return { success: false, error: AUTH_MSG };
}
