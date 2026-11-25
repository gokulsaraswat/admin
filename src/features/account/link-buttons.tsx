"use client";

import { useActionState, useState } from "react";
import { AUTH_PROVIDERS, type AuthProviderId } from "@gokulsaraswat/auth";
import { ProviderMark } from "@/components/provider-mark";
import { linkAccount, type AccountState } from "./actions";

/** One "Link <provider>" button per provider the user has not linked yet. */
export function LinkButtons({ linked }: { linked: readonly string[] }) {
  const [state, action, pending] = useActionState<AccountState, FormData>(linkAccount, {});
  const [chosen, setChosen] = useState<AuthProviderId | null>(null);
  const available = AUTH_PROVIDERS.filter((p) => !linked.includes(p.id));

  if (available.length === 0) return <p className="text-sm text-muted-foreground">Every sign-in method is linked.</p>;

  return (
    <form action={action} className="flex flex-wrap gap-2" aria-busy={pending}>
      {available.map((p) => (
        <button
          key={p.id}
          type="submit"
          name="provider"
          value={p.id}
          disabled={pending}
          onClick={() => setChosen(p.id)}
          className="flex h-10 items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors duration-150 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
        >
          <ProviderMark provider={p.id} />
          {pending && chosen === p.id ? "Redirecting…" : `Link ${p.label}`}
        </button>
      ))}
      {state.error && (
        <p role="alert" className="basis-full text-sm text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}
