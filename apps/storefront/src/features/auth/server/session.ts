import { cookies } from "next/headers";

const SESSION_COOKIE = "galle_session";

export async function setSessionToken(_token: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, _token, {
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

export async function getSessionCustomer(): Promise<null> {
  return null;
}
