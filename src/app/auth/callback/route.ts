import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/";
  return value;
}

/** OAuth return URL: swaps the PKCE code for a session cookie, then goes to `next` (relative paths only). */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(safeNext(searchParams.get("next")), origin));
    console.error("exchangeCodeForSession failed:", error.code, error.message);
  }

  return NextResponse.redirect(new URL("/login?error=oauth", origin));
}
