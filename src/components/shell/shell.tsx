import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppMark } from "@/components/app-mark";
import { CurrentUser } from "@/components/shell/current-user";
import { Rail } from "@/components/shell/rail";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSession } from "@/lib/session";

export async function Shell({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = <CurrentUser email={session.email} superAdmin={session.superAdmin} />;

  if (session.apps.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-lg font-semibold">You don&apos;t have access to any app yet</h1>
          <p className="mt-2 text-sm text-muted-foreground">Ask a super admin to add you to an app. Then sign in again.</p>
          <div className="mt-6">{user}</div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-full flex-1 md:h-dvh">
      <Rail apps={session.apps} />
      <nav aria-label="Platform" className="hidden w-56 flex-col gap-0.5 border-r border-sidebar-border bg-sidebar px-2.5 py-3.5 text-sidebar-foreground md:flex">
        <h2 className="mx-2 mb-3 flex items-center gap-2 font-semibold">
          <AppMark app="platform" letter="G" size="sm" /> Platform
        </h2>
        <span aria-current="page" className="flex h-8 items-center rounded-md bg-sidebar-accent px-2 text-sm font-medium">
          Overview
        </span>
        <span className="flex-1" />
        {user}
      </nav>
      <div className="flex min-w-0 flex-1 flex-col overflow-auto">
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background px-4 py-2.5 md:hidden">
          <AppMark app="platform" letter="G" size="sm" />
          <b className="flex-1">Admin</b>
          <ThemeToggle />
          {user}
        </div>
        {children}
      </div>
    </div>
  );
}

export function ShellFallback() {
  return (
    <div className="flex min-h-full flex-1 md:h-dvh" aria-busy="true">
      <div className="hidden w-14 border-r border-sidebar-border bg-sidebar md:block" />
      <div className="hidden w-56 border-r border-sidebar-border bg-sidebar md:block" />
      <div className="flex-1 p-6">
        <div className="h-6 w-40 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  );
}
