"use client";

import { useActionState, useState } from "react";
import { AUTH_PROVIDERS, type AuthProviderId } from "@gokulsaraswat/auth";
import { ProviderMark } from "@/components/provider-mark";
import { signInWithOAuth, type SignInState } from "./actions";

export function ProviderButtons() {
  const [state, action, pending] = useActionState<SignInState, FormData>(signInWithOAuth, {});
  const [chosen, setChosen] = useState<AuthProviderId | null>(null);

  return (
    <form action={action} className="grid gap-2" aria-busy={pending}>
      {AUTH_PROVIDERS.map((p) => (
        <button
          key={p.id}
          type="submit"
          name="provider"
          value={p.id}
          disabled={pending}
          onClick={() => setChosen(p.id)}
          className="flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-background font-medium transition-colors duration-150 hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-60"
        >
          <ProviderMark provider={p.id} />
          {pending && chosen === p.id ? "Redirecting…" : `Continue with ${p.label}`}
        </button>
      ))}
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
    </form>
  );
}
