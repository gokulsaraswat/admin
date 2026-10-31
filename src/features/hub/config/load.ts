import "server-only";
import { hubConfigSchema, type HubConfig } from "@gokulsaraswat/config";
import { supabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { HUB_CONFIG_BUCKET, HUB_CONFIG_PATH } from "./constants";

export interface HubConfigState {
  canEdit: boolean;
  config: HubConfig;
  /** Set when a published file exists but fails validation; the editor starts empty then. */
  problem?: string;
  publicUrl: string;
}

const empty: HubConfig = { version: 1, apps: [] };

export async function loadHubConfig(): Promise<HubConfigState> {
  const supabase = await createClient();
  const publicUrl = `${supabaseEnv().url.replace(/\/$/, "")}/storage/v1/object/public/${HUB_CONFIG_BUCKET}/${HUB_CONFIG_PATH}`;

  const { data: canEdit, error: rpcError } = await supabase.rpc("has_permission", { p_app: "hub", p_permission: "config.edit" });
  if (rpcError) throw rpcError;
  if (!canEdit) return { canEdit: false, config: empty, publicUrl };

  const { data: file, error } = await supabase.storage.from(HUB_CONFIG_BUCKET).download(HUB_CONFIG_PATH);
  if (error || !file) return { canEdit: true, config: empty, publicUrl };

  try {
    const parsed = hubConfigSchema.safeParse(JSON.parse(await file.text()));
    if (parsed.success) return { canEdit: true, config: parsed.data, publicUrl };
    return { canEdit: true, config: empty, publicUrl, problem: parsed.error.issues[0]?.message };
  } catch {
    return { canEdit: true, config: empty, publicUrl, problem: "the published file is not valid JSON" };
  }
}
