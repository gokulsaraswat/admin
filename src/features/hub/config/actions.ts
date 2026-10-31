"use server";

import { hubConfigSchema } from "@gokulsaraswat/config";
import { createClient } from "@/lib/supabase/server";
import { HUB_CONFIG_BUCKET, HUB_CONFIG_PATH } from "./constants";

export type PublishState = { error?: string; publishedAt?: string };

/** Validates on the server again, then uploads. Storage RLS decides if this user may write. */
export async function publishHubConfig(_prev: PublishState, formData: FormData): Promise<PublishState> {
  let input: unknown;
  try {
    input = JSON.parse(String(formData.get("config") ?? ""));
  } catch {
    return { error: "The config could not be read. Reload the page and try again." };
  }
  const parsed = hubConfigSchema.safeParse(input);
  if (!parsed.success) return { error: `Not published: ${parsed.error.issues[0]?.message ?? "invalid config"}.` };

  const supabase = await createClient();
  const body = new Blob([`${JSON.stringify(parsed.data, null, 2)}\n`], { type: "application/json" });
  const { error } = await supabase.storage
    .from(HUB_CONFIG_BUCKET)
    .upload(HUB_CONFIG_PATH, body, { upsert: true, contentType: "application/json", cacheControl: "60" });
  if (error) {
    console.error("publishHubConfig failed:", error.message);
    return { error: "Not published: you may not have the Config permission, or the upload failed." };
  }
  return { publishedAt: new Date().toISOString() };
}
