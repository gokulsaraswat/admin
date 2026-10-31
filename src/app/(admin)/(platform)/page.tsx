import Link from "next/link";
import { AppMark } from "@/components/app-mark";
import { getSession } from "@/lib/session";

export default async function Overview() {
  const session = await getSession();
  const apps = session?.apps ?? [];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <h1 className="text-xl font-semibold">Overview</h1>
      <p className="mt-1 text-muted-foreground">Your apps. Each one gets its own sections as it is connected.</p>
      <ul className="mt-6 divide-y divide-border rounded-lg border border-border">
        {apps.map((app) => {
          const body = (
            <>
              <AppMark app={app.id} letter={app.mark} dimmed={!app.ready} />
              <span className="flex-1 font-medium">{app.name}</span>
              <span className="text-sm text-muted-foreground">{app.ready ? `${app.sections.length} sections` : "Not set up yet"}</span>
            </>
          );
          return (
            <li key={app.id}>
              {app.ready ? (
                <Link href={`/${app.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-accent">{body}</Link>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
