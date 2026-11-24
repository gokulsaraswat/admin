import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AccessRequest } from "./types";

const statusOrder: Record<AccessRequest["status"], number> = { pending: 0, denied: 1, approved: 2 };

/** Requests RLS lets the caller see (own rows + apps they admin), pending first, newest first. */
export async function loadAccessRequests(): Promise<AccessRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("access_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as AccessRequest[]).sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
}
