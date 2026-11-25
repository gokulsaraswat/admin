"use client";

import { useSearchParams } from "next/navigation";

export function CallbackError() {
  if (useSearchParams().get("error") !== "oauth") return null;
  return (
    <p role="alert" className="mb-4 text-sm text-destructive">
      Sign-in did not finish. Try again.
    </p>
  );
}
