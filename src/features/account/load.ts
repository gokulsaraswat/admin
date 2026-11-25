import "server-only";
import { listIdentities } from "@gokulsaraswat/auth";
import { createClient } from "@/lib/supabase/server";
import type { IdentityRow } from "./types";

const date = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

/** The signed-in user's sign-in methods, oldest first. */
export async function loadIdentities(): Promise<IdentityRow[]> {
  const supabase = await createClient();
  const identities = await listIdentities(supabase);
  return identities.map((i) => ({
    identityId: i.identityId,
    provider: i.provider,
    email: i.email,
    linkedOn: i.createdAt ? date.format(new Date(i.createdAt)) : null,
  }));
}
