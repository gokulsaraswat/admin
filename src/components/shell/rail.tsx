import Link from "next/link";
import { AppMark } from "@/components/app-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { managedApps } from "@/lib/apps";

export function Rail() {
  return (
    <nav aria-label="Apps" className="hidden w-14 flex-col items-center gap-2 border-r border-sidebar-border bg-sidebar py-3 md:flex">
      <Link
        href="/"
        title="Overview"
        aria-current="page"
        className="relative grid size-10 place-items-center rounded-lg hover:bg-sidebar-accent before:absolute before:-left-2 before:inset-y-2.5 before:w-[3px] before:rounded-r before:bg-primary"
      >
        <AppMark app="platform" letter="G" />
      </Link>
      {managedApps.map((app) => (
        <span key={app.id} title={`${app.name}: not set up yet`} className="grid size-10 place-items-center rounded-lg">
          <AppMark app={app.id} letter={app.mark} dimmed />
          <span className="sr-only">{app.name} (not set up yet)</span>
        </span>
      ))}
      <span className="flex-1" />
      <ThemeToggle />
    </nav>
  );
}
