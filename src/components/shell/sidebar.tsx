import { AppMark } from "@/components/app-mark";
import { CurrentUser } from "@/components/shell/current-user";
import { NavLink } from "@/components/shell/nav-link";
import type { ManagedAppId } from "@/lib/apps";
import { getSession } from "@/lib/session";

interface SidebarProps {
  title: string;
  app: ManagedAppId | "platform";
  mark: string;
  links: readonly { href: string; label: string }[];
}

export async function Sidebar({ title, app, mark, links }: SidebarProps) {
  const session = await getSession();
  return (
    <nav aria-label={title} className="hidden w-56 shrink-0 flex-col gap-0.5 overflow-auto border-r border-sidebar-border bg-sidebar px-2.5 py-3.5 text-sidebar-foreground md:flex">
      <h2 className="mx-2 mb-3 flex items-center gap-2 font-semibold">
        <AppMark app={app} letter={mark} size="sm" /> {title}
      </h2>
      {links.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          className="flex h-8 items-center rounded-md px-2 text-sm hover:bg-sidebar-accent aria-[current=page]:bg-sidebar-accent aria-[current=page]:font-medium"
        >
          {link.label}
        </NavLink>
      ))}
      <span className="flex-1" />
      {session && <CurrentUser email={session.email} superAdmin={session.superAdmin} />}
    </nav>
  );
}
