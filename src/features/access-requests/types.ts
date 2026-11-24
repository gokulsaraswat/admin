import type { AppId } from "@gokulsaraswat/config";

export type AccessRequestStatus = "pending" | "approved" | "denied";
export type GrantableRole = "member" | "admin";

/** One row of `public.access_requests` (contract: platform/docs/CONTRACTS.md). */
export interface AccessRequest {
  id: string;
  user_id: string;
  app: AppId;
  email: string;
  name: string | null;
  status: AccessRequestStatus;
  requested_role: GrantableRole;
  created_at: string;
  decided_at: string | null;
  decided_by: string | null;
}

export type DecideState = { error?: string };
