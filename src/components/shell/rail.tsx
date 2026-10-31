import { AppMark } from "@/components/app-mark";
import { NavLink } from "@/components/shell/nav-link";
import { ThemeToggle } from "@/components/theme-toggle";
import type { AppMeta, ManagedAppId } from "@/lib/apps";

const item =
  "relative grid size-10 place-items-center rounded-lg hover:bg-sidebar-accent before:absolute before:-left-2 before:inset-y-2.5 before:w-[3px] before:rounded-r before:opacity-0 aria-[current=page]:before:opacity-100";

const bar: Record<ManagedAppId | "platform", string> = {
  platform: "before:bg-primary",
  portfolio: "before:bg-app-portfolio",
  hub: "before:bg-app-hub",
  gspace: "before:bg-app-gspace",
  studio: "before:bg-app-studio",
  gym: "before:bg-app-gym",
};

export function Rail({ apps }: { apps: readonly AppMeta[] }) {
  return (
    <nav aria-label="Apps" className="hidden w-14 shrink-0 flex-col items-center gap-2 border-r border-sidebar-border bg-sidebar py-3 md:flex">
      <NavLink href="/" title="Overview" className={`${item} ${bar.platform}`}>
        <AppMark app="platform" letter="G" />
      </NavLink>
      {apps.map((app) =>
        app.ready ? (
          <NavLink key={app.id} href={`/${app.id}`} prefix title={app.name} className={`${item} ${bar[app.id]}`}>
            <AppMark app={app.id} letter={app.mark} />
          </NavLink>
        ) : (
          <span key={app.id} title={`${app.name}: not set up yet`} className="grid size-10 place-items-center rounded-lg">
            <AppMark app={app.id} letter={app.mark} dimmed />
            <span className="sr-only">{app.name} (not set up yet)</span>
          </span>
        ),
      )}
      <span className="flex-1" />
      <ThemeToggle />
    </nav>
  );
}
