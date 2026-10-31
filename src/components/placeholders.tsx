import Link from "next/link";
import type { AppMeta, AppSection } from "@/lib/apps";

/** App landing page: its sections with what each is for. */
export function AppHome({ app, note }: { app: AppMeta; note: string }) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <h1 className="text-xl font-semibold">{app.name}</h1>
      <p className="mt-1 text-muted-foreground">{note}</p>
      <ul className="mt-6 divide-y divide-border rounded-lg border border-border">
        {app.sections.map((s) => (
          <li key={s.slug}>
            <Link href={`/${app.id}/${s.slug}`} className="block px-4 py-3 hover:bg-accent">
              <span className="font-medium">{s.label}</span>
              <span className="block text-sm text-muted-foreground">{s.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

/** A section that exists in the navigation but is not built yet. */
export function EmptySection({ section, note }: { section: AppSection; note: string }) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <h1 className="text-xl font-semibold">{section.label}</h1>
      <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center">
        <p className="font-medium">{section.description}</p>
        <p className="mt-2 text-sm text-muted-foreground">{note}</p>
      </div>
    </main>
  );
}
