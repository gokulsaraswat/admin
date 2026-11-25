const messages: Record<string, string> = {
  identity_already_exists: "That account is already linked to another user. Sign in with it, unlink it there, then try again.",
  manual_linking_disabled: "Linking accounts is turned off for this project (Supabase Auth: Allow manual linking).",
  provider_disabled: "That provider is not enabled yet.",
  single_identity_not_deletable: "You can't remove your only sign-in method.",
  last_identity: "You can't remove your only sign-in method.",
  identity_not_found: "That sign-in method is no longer linked. Reload the page.",
};

/** User-facing text for a Supabase / `IdentityError` code, including the `?error=` codes the OAuth callback passes to /account. */
export function accountErrorMessage(code: string | null | undefined, fallback = "Linking did not finish. Try again in a minute."): string {
  return (code && messages[code]) || fallback;
}
