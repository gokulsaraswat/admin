import type { AppId } from "@gokulsaraswat/config";

export type ManagedAppId = Exclude<AppId, "admin">;

export interface AppMeta {
  id: ManagedAppId;
  name: string;
  mark: string;
}

/** Rail order. Colour per app: `--app-<id>` in globals.css (docs/DESIGN.md section 2). */
export const managedApps: readonly AppMeta[] = [
  { id: "portfolio", name: "Portfolio", mark: "P" },
  { id: "hub", name: "Hub", mark: "H" },
  { id: "gspace", name: "GSpace", mark: "S" },
  { id: "studio", name: "Studio", mark: "M" },
  { id: "gym", name: "Gym", mark: "Y" },
];
