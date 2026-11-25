"use client";

import { useActionState, useState } from "react";
import { unlinkAccount, type AccountState } from "./actions";

interface UnlinkButtonProps {
  identityId: string;
  label: string;
  /** The only sign-in method left: the button stays disabled. */
  last: boolean;
}

const button =
  "h-9 rounded-md px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50";

export function UnlinkButton({ identityId, label, last }: UnlinkButtonProps) {
  const [state, action, pending] = useActionState<AccountState, FormData>(unlinkAccount, {});
  const [confirming, setConfirming] = useState(false);

  if (last) {
    return (
      <button type="button" disabled className={`${button} border border-border`} title="Your only sign-in method can't be removed">
        Unlink
      </button>
    );
  }

  return (
    <form action={action} className="flex flex-wrap items-center justify-end gap-2" aria-busy={pending}>
      <input type="hidden" name="identityId" value={identityId} />
      {confirming ? (
        <>
          <span className="text-sm text-muted-foreground">Remove {label}?</span>
          <button type="submit" disabled={pending} className={`${button} bg-destructive text-white hover:opacity-90`}>
            {pending ? "Removing…" : "Unlink"}
          </button>
          <button type="button" disabled={pending} onClick={() => setConfirming(false)} className={`${button} border border-border hover:bg-accent`}>
            Cancel
          </button>
        </>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} className={`${button} border border-border text-destructive hover:bg-accent`}>
          Unlink
        </button>
      )}
      {state.error && <p role="alert" className="basis-full text-right text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
