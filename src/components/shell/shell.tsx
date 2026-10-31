import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { CurrentUser } from "@/components/shell/current-user";
import { MobileMenu } from "@/components/shell/mobile-menu";
import { Rail } from "@/components/shell/rail";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSession } from "@/lib/session";

/** Rail + phone top bar. Each area (platform, portfolio, hub...) renders its own sidebar inside `children`. */
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
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background px-3 py-2 md:hidden">
          <MobileMenu apps={session.apps} />
          <span className="flex-1" />
          <ThemeToggle />
          {user}
        </div>
        <div className="flex min-h-0 flex-1">{children}</div>
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
