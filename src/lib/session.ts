import "server-only";
import { cache } from "react";
import { getUserRoles, hasRole, isSuperAdmin } from "@gokulsaraswat/auth";
import type { UserRole } from "@gokulsaraswat/config";
import { managedApps, type AppMeta } from "@/lib/apps";
import { createClient } from "@/lib/supabase/server";

export interface Session {
  userId: string;
  email: string;
  roles: UserRole[];
  superAdmin: boolean;
  /** Apps this user may open. Shapes the UI only; RLS enforces access. */
  apps: AppMeta[];
}

/** Signed-in user + roles, loaded once per request. Null when signed out. */
export const getSession = cache(async (): Promise<Session | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;

  const roles = await getUserRoles(supabase, claims.sub);
  return {
    userId: claims.sub,
    email: typeof claims.email === "string" ? claims.email : "",
    roles,
    superAdmin: isSuperAdmin(roles),
    apps: managedApps.filter((app) => hasRole(roles, app.id, "member")),
  };
});
