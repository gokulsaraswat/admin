"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { DecideState } from "./types";

const knownCodes = new Set(["42501", "22023", "P0002"]);

/** Calls `decide_access_request`; the function itself checks who may approve what. */
export async function decideAccessRequest(_prev: DecideState, formData: FormData): Promise<DecideState> {
  const id = String(formData.get("id") ?? "");
  const approve = formData.get("decision") === "approve";
  const role = formData.get("role") === "admin" ? "admin" : "member";
  if (!id) return { error: "Missing request. Reload the page and try again." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("decide_access_request", { p_id: id, p_approve: approve, p_role: role });
  if (error) {
    if (error.code && knownCodes.has(error.code)) return { error: error.message };
    console.error("decideAccessRequest failed:", error.code, error.message);
    return { error: "Could not save the decision. Try again in a minute." };
  }
  revalidatePath("/access-requests");
  return {};
}
