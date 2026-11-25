import { AUTH_PROVIDERS } from "@gokulsaraswat/auth";

/** "Google", "GitHub"; "Email" for password accounts; the raw id otherwise. */
export function providerLabel(id: string): string {
  if (id === "email") return "Email";
  return AUTH_PROVIDERS.find((p) => p.id === id)?.label ?? id;
}
