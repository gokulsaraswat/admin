import "server-only";
import { headers } from "next/headers";

async function requestOrigin(): Promise<string> {
  const h = await headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  return `${h.get("x-forwarded-proto") ?? "https"}://${host}`;
}

/** `<origin>/auth/callback?next=<path>`; the callback must be in Supabase Auth > URL Configuration > Redirect URLs. */
export async function oauthCallbackUrl(next: "/" | "/account"): Promise<string> {
  return `${await requestOrigin()}/auth/callback?next=${next}`;
}
