"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { IdentityError, isAuthProviderId, linkProvider, unlinkProvider } from "@gokulsaraswat/auth";
import { oauthCallbackUrl } from "@/lib/oauth";
import { providerLabel } from "@/lib/provider-label";
import { createClient } from "@/lib/supabase/server";
import { accountErrorMessage } from "./messages";

export type AccountState = { error?: string };

const codeOf = (error: unknown) => (error as { code?: string }).code;

/** Starts linking the provider in the form's `provider` field; Supabase returns to /auth/callback?next=/account. */
export async function linkAccount(_prev: AccountState, formData: FormData): Promise<AccountState> {
  const provider = formData.get("provider");
  if (!isAuthProviderId(provider)) return { error: "Unknown sign-in method." };

  let url: string;
  try {
    const supabase = await createClient();
    ({ url } = await linkProvider(supabase, provider, { redirectTo: await oauthCallbackUrl("/account"), skipBrowserRedirect: true }));
  } catch (error) {
    console.error(`linkAccount(${provider}) failed:`, codeOf(error), (error as Error).message);
    return { error: accountErrorMessage(codeOf(error), `${providerLabel(provider)} linking is unavailable right now. Try again in a minute.`) };
  }
  redirect(url);
}

/** Removes the identity in the form's `identityId` field; refuses the last one. */
export async function unlinkAccount(_prev: AccountState, formData: FormData): Promise<AccountState> {
  const identityId = String(formData.get("identityId") ?? "");
  if (!identityId) return { error: "Missing sign-in method. Reload the page and try again." };

  try {
    const supabase = await createClient();
    await unlinkProvider(supabase, { identityId });
  } catch (error) {
    if (!(error instanceof IdentityError)) console.error("unlinkAccount failed:", codeOf(error), (error as Error).message);
    return { error: accountErrorMessage(codeOf(error), "Could not remove it. Try again in a minute.") };
  }
  revalidatePath("/account");
  return {};
}
