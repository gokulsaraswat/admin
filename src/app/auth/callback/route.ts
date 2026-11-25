import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/";
  return value;
}

function failure(next: string, code: string | null, origin: string): NextResponse {
  if (next === "/account") {
    const target = new URL("/account", origin);
    target.searchParams.set("error", code && /^[a-z_]{1,64}$/.test(code) ? code : "oauth");
    return NextResponse.redirect(target);
  }
  return NextResponse.redirect(new URL("/login?error=oauth", origin));
}

/**
 * OAuth return URL for sign-in and identity linking: swaps the PKCE code for a session cookie,
 * then goes to `next` (relative paths only). Linking failures (`next=/account`) go back to /account with the error code.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
    console.error("exchangeCodeForSession failed:", error.code, error.message);
    return failure(next, error.code ?? null, origin);
  }

  const errorCode = searchParams.get("error_code") ?? searchParams.get("error");
  if (errorCode) console.error("OAuth callback error:", errorCode, searchParams.get("error_description"));
  return failure(next, errorCode, origin);
}
