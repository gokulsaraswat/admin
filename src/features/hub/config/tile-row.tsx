"use client";

import { appIds, tileModes, type HubTile } from "@gokulsaraswat/config";

const modeLabel: Record<HubTile["mode"], string> = {
  bundled: "Bundled (inside the hub app)",
  remote: "Remote (path on this domain)",
  external: "External (another website)",
};

const field = "h-9 w-full rounded-md border border-input bg-background px-2.5 text-sm";

interface TileRowProps {
  tile: HubTile;
  index: number;
  count: number;
  errors: Partial<Record<keyof HubTile, string>>;
  onChange: (tile: HubTile) => void;
  onMove: (delta: -1 | 1) => void;
  onRemove: () => void;
}

export function TileRow({ tile, index, count, errors, onChange, onMove, onRemove }: TileRowProps) {
  const id = `tile-${index}`;
  return (
    <li className="grid gap-3 p-4 md:grid-cols-[8rem_1fr_1fr_14rem_auto] md:items-start">
      <label className="grid gap-1 text-xs text-muted-foreground">
        App
        <select className={field} value={tile.id} onChange={(e) => onChange({ ...tile, id: e.target.value as HubTile["id"] })}>
          {appIds.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        {errors.id && <span className="text-destructive">{errors.id}</span>}
      </label>
      <label className="grid gap-1 text-xs text-muted-foreground">
        Name on the tile
        <input className={field} value={tile.name} onChange={(e) => onChange({ ...tile, name: e.target.value })} />
        {errors.name && <span className="text-destructive">{errors.name}</span>}
      </label>
      <label className="grid gap-1 text-xs text-muted-foreground">
        Link
        <input
          className={field}
          value={tile.href}
          placeholder={tile.mode === "external" ? "https://…" : "/path"}
          aria-describedby={errors.href ? `${id}-href` : undefined}
          onChange={(e) => onChange({ ...tile, href: e.target.value })}
        />
        {errors.href && <span id={`${id}-href`} className="text-destructive">{errors.href}</span>}
      </label>
      <label className="grid gap-1 text-xs text-muted-foreground">
        Opens as
        <select className={field} value={tile.mode} onChange={(e) => onChange({ ...tile, mode: e.target.value as HubTile["mode"] })}>
          {tileModes.map((m) => (
            <option key={m} value={m}>{modeLabel[m]}</option>
          ))}
        </select>
      </label>
      <div className="flex items-center gap-1 md:pt-5">
        <label className="mr-2 flex items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-primary" checked={tile.enabled} onChange={(e) => onChange({ ...tile, enabled: e.target.checked })} />
          Shown
        </label>
        <button type="button" className="size-9 rounded-md hover:bg-accent disabled:opacity-40" disabled={index === 0} onClick={() => onMove(-1)} aria-label={`Move ${tile.name || tile.id} up`}>↑</button>
        <button type="button" className="size-9 rounded-md hover:bg-accent disabled:opacity-40" disabled={index === count - 1} onClick={() => onMove(1)} aria-label={`Move ${tile.name || tile.id} down`}>↓</button>
        <button type="button" className="h-9 rounded-md px-2 text-destructive hover:bg-accent" onClick={onRemove}>Remove</button>
      </div>
    </li>
  );
}
