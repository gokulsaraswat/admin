"use client";

import { useActionState } from "react";
import { decideAccessRequest } from "./actions";
import type { AccessRequest, DecideState } from "./types";

interface DecideFormProps {
  request: Pick<AccessRequest, "id" | "email" | "status">;
  /** Shows the role picker; only super admins may grant admin (the database enforces it too). */
  canGrantAdmin: boolean;
}

const button =
  "h-9 rounded-md px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-50";

export function DecideForm({ request, canGrantAdmin }: DecideFormProps) {
  const [state, action, pending] = useActionState<DecideState, FormData>(decideAccessRequest, {});

  return (
    <form action={action} className="flex flex-wrap items-center justify-end gap-2" aria-busy={pending}>
      <input type="hidden" name="id" value={request.id} />
      {canGrantAdmin ? (
        <select name="role" defaultValue="member" disabled={pending} aria-label={`Role for ${request.email}`}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm">
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      ) : (
        <input type="hidden" name="role" value="member" />
      )}
      <button type="submit" name="decision" value="approve" disabled={pending}
        className={`${button} bg-primary text-primary-foreground hover:opacity-90`}>
        {pending ? "Saving…" : request.status === "approved" ? "Set role" : "Approve"}
      </button>
      {request.status === "pending" && (
        <button type="submit" name="decision" value="deny" disabled={pending}
          className={`${button} border border-border text-destructive hover:bg-accent`}>
          Deny
        </button>
      )}
      {state.error && <p role="alert" className="basis-full text-right text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
