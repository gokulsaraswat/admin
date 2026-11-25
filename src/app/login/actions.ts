"use server";

import { redirect } from "next/navigation";
import { isAuthProviderId, signInWithProvider } from "@gokulsaraswat/auth";
import { oauthCallbackUrl } from "@/lib/oauth";
import { providerLabel } from "@/lib/provider-label";
import { createClient } from "@/lib/supabase/server";

export type SignInState = { error?: string; email?: string };

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password.", email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error?.code === "invalid_credentials") return { error: "Email or password is incorrect.", email };
  if (error) {
    console.error("signIn failed:", error.code, error.message);
    return { error: "Sign-in is unavailable right now. Try again in a minute.", email };
  }

  redirect("/");
}

/** OAuth sign-in for the provider in the form's `provider` field (see `AUTH_PROVIDERS`). */
export async function signInWithOAuth(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const provider = formData.get("provider");
  if (!isAuthProviderId(provider)) return { error: "Unknown sign-in method." };

  let url: string;
  try {
    const supabase = await createClient();
    ({ url } = await signInWithProvider(supabase, provider, { redirectTo: await oauthCallbackUrl("/") }));
  } catch (error) {
    console.error(`signInWithOAuth(${provider}) failed:`, (error as { code?: string }).code, (error as Error).message);
    return { error: `${providerLabel(provider)} sign-in is unavailable right now. Try again in a minute.` };
  }
  redirect(url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
