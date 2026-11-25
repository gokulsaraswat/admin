/** A linked sign-in method as shown on /account (no raw Supabase row reaches the browser). */
export interface IdentityRow {
  identityId: string;
  provider: string;
  email: string | null;
  /** Already formatted for display, or null when Supabase has no date. */
  linkedOn: string | null;
}
