import type { ReactNode } from "react";
import { Sidebar } from "@/components/shell/sidebar";
import { getApp, type ManagedAppId } from "@/lib/apps";
import { getSession } from "@/lib/session";

/** Layout body for one app: access check + the app's own sidebar. RLS still guards the data. */
export async function AppArea({ appId, children }: { appId: ManagedAppId; children: ReactNode }) {
  const app = getApp(appId);
  const session = await getSession();
  const allowed = session?.apps.some((a) => a.id === appId) ?? false;

  if (!allowed) {
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-lg font-semibold">You don&apos;t have access to {app.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Ask a {app.name} admin or a super admin to add you.</p>
        </div>
      </main>
    );
  }

  const links = [{ href: `/${app.id}`, label: "Overview" }, ...app.sections.map((s) => ({ href: `/${app.id}/${s.slug}`, label: s.label }))];
  return (
    <>
      <Sidebar title={app.name} app={app.id} mark={app.mark} links={links} />
      <div className="min-w-0 flex-1 overflow-auto">{children}</div>
    </>
  );
}
