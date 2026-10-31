"use client";

import { useActionState, useMemo, useState } from "react";
import { appIds, hubConfigSchema, type HubConfig, type HubTile } from "@gokulsaraswat/config";
import { publishHubConfig, type PublishState } from "./actions";
import { TileRow } from "./tile-row";

type RowErrors = Partial<Record<keyof HubTile, string>>;

function validate(config: HubConfig) {
  const result = hubConfigSchema.safeParse(config);
  const rows: RowErrors[] = config.apps.map(() => ({}));
  const general: string[] = [];
  if (!result.success) {
    for (const issue of result.error.issues) {
      const [, index, key] = issue.path;
      if (typeof index === "number" && typeof key === "string") rows[index][key as keyof HubTile] ??= issue.message;
      else general.push(issue.message);
    }
  }
  return { valid: result.success, rows, general };
}

export function HubConfigEditor({ initial, publicUrl }: { initial: HubConfig; publicUrl: string }) {
  const [tiles, setTiles] = useState<HubTile[]>(initial.apps);
  const [saved, setSaved] = useState(JSON.stringify(initial.apps));
  const [state, action, pending] = useActionState<PublishState, FormData>(async (prev, data) => {
    const next = await publishHubConfig(prev, data);
    if (next.publishedAt) setSaved(JSON.stringify((JSON.parse(String(data.get("config"))) as HubConfig).apps));
    return next;
  }, {});

  const config: HubConfig = { version: 1, apps: tiles };
  const { valid, rows, general } = useMemo(() => validate({ version: 1, apps: tiles }), [tiles]);
  const dirty = JSON.stringify(tiles) !== saved;

  const update = (i: number, tile: HubTile) => setTiles((t) => t.map((x, j) => (j === i ? tile : x)));
  const move = (i: number, delta: -1 | 1) =>
    setTiles((t) => {
      const next = [...t];
      [next[i], next[i + delta]] = [next[i + delta], next[i]];
      return next;
    });
  const add = () => {
    const id = appIds.find((a) => !tiles.some((t) => t.id === a)) ?? appIds[0];
    setTiles((t) => [...t, { id, name: "", href: `/${id}`, mode: "remote", enabled: true }]);
  };

  return (
    <form action={action} className="mt-6 grid gap-4">
      <input type="hidden" name="config" value={JSON.stringify(config)} />
      {tiles.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="font-medium">No tiles yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Add a tile for each app the hub should show.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border">
          {tiles.map((tile, i) => (
            <TileRow key={i} tile={tile} index={i} count={tiles.length} errors={rows[i]}
              onChange={(t) => update(i, t)} onMove={(d) => move(i, d)} onRemove={() => setTiles((t) => t.filter((_, j) => j !== i))} />
          ))}
        </ul>
      )}
      {general.map((g) => (
        <p key={g} role="alert" className="text-sm text-destructive">{g}</p>
      ))}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={add} disabled={tiles.length >= appIds.length} className="h-10 rounded-md border border-border px-4 hover:bg-accent disabled:opacity-50">
          Add tile
        </button>
        <span className="flex-1" />
        {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
        {!dirty && state.publishedAt && <p className="text-sm text-muted-foreground">Published. The hub picks it up within a minute.</p>}
        <button type="submit" disabled={!valid || !dirty || pending} className="h-10 rounded-md bg-primary px-4 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50">
          {pending ? "Publishing…" : "Publish"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Public file: <a className="underline" href={publicUrl} target="_blank" rel="noreferrer">{publicUrl}</a>
      </p>
    </form>
  );
}
