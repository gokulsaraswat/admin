import type { Metadata } from "next";
import { accountErrorMessage } from "@/features/account/messages";
import { IdentityList } from "@/features/account/identity-list";
import { LinkButtons } from "@/features/account/link-buttons";
import { loadIdentities } from "@/features/account/load";

export const metadata: Metadata = { title: "Connected accounts · Admin" };

export default async function Account({ searchParams }: PageProps<"/account">) {
  const [identities, { error }] = await Promise.all([loadIdentities(), searchParams]);
  const callbackError = typeof error === "string" ? accountErrorMessage(error) : null;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6">
      <h1 className="text-xl font-semibold">Connected accounts</h1>
      <p className="mt-1 text-muted-foreground">
        Ways you can sign in to every app. Accounts with the same verified email join automatically; link others here.
      </p>
      {callbackError && (
        <p role="alert" className="mt-4 rounded-md border border-destructive/40 px-3 py-2 text-sm text-destructive">
          {callbackError}
        </p>
      )}
      <section className="mt-6">
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">Linked</h2>
        <IdentityList identities={identities} />
      </section>
      <section className="mt-6">
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">Link another</h2>
        <LinkButtons linked={identities.map((i) => i.provider)} />
      </section>
    </main>
  );
}
