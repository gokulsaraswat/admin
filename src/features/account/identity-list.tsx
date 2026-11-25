import { ProviderMark } from "@/components/provider-mark";
import { providerLabel } from "@/lib/provider-label";
import type { IdentityRow } from "./types";
import { UnlinkButton } from "./unlink-button";

export function IdentityList({ identities }: { identities: readonly IdentityRow[] }) {
  const last = identities.length < 2;
  return (
    <ul className="divide-y divide-border rounded-lg border border-border">
      {identities.map((i) => {
        const label = providerLabel(i.provider);
        return (
          <li key={i.identityId} className="flex flex-wrap items-center gap-3 px-4 py-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border">
              <ProviderMark provider={i.provider} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{label}</p>
              <p className="truncate text-sm text-muted-foreground">
                {i.email ?? "No email"}
                {i.linkedOn && <> · linked {i.linkedOn}</>}
              </p>
            </div>
            <UnlinkButton identityId={i.identityId} label={label} last={last} />
          </li>
        );
      })}
    </ul>
  );
}
