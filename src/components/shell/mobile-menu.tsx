"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { AppMark } from "@/components/app-mark";
import type { AppMeta } from "@/lib/apps";
import type { NavItem } from "@/lib/platform-nav";

const row = "flex h-11 items-center gap-3 rounded-md px-3 hover:bg-accent aria-[current=page]:bg-accent aria-[current=page]:font-medium";

interface MobileMenuProps {
  apps: readonly AppMeta[];
  /** Platform pages besides Overview (e.g. Access requests). */
  platformLinks?: readonly NavItem[];
}

/** Phone navigation: apps + the current app's sections in one menu. */
export function MobileMenu({ apps, platformLinks = [] }: MobileMenuProps) {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  const current = apps.find((a) => pathname === `/${a.id}` || pathname.startsWith(`/${a.id}/`));
  const close = () => menu.current?.removeAttribute("open");
  const is = (href: string) => (pathname === href ? "page" : undefined);
  const extra = platformLinks.filter((l) => l.href !== "/");
  const title = current?.name ?? extra.find((l) => l.href === pathname)?.label ?? "Overview";

  return (
    <details ref={menu} className="relative">
      <summary className="flex h-8 cursor-pointer list-none items-center gap-2 rounded-md px-2 font-semibold hover:bg-accent [&::-webkit-details-marker]:hidden">
        {current ? <AppMark app={current.id} letter={current.mark} size="sm" /> : <AppMark app="platform" letter="G" size="sm" />}
        {title} <span aria-hidden className="text-xs text-muted-foreground">▼</span>
      </summary>
      <div className="absolute left-0 top-10 z-20 w-[calc(100vw-2rem)] max-w-sm rounded-lg border border-border bg-popover p-1.5 text-popover-foreground shadow-lg">
        <Link href="/" onClick={close} aria-current={is("/")} className={row}>
          <AppMark app="platform" letter="G" size="sm" /> Overview
        </Link>
        {extra.map((l) => (
          <Link key={l.href} href={l.href} onClick={close} aria-current={is(l.href)} className={`${row} pl-11`}>
            {l.label}
          </Link>
        ))}
        {apps.filter((a) => a.ready).map((app) => (
          <Link key={app.id} href={`/${app.id}`} onClick={close} aria-current={is(`/${app.id}`)} className={row}>
            <AppMark app={app.id} letter={app.mark} size="sm" /> {app.name}
          </Link>
        ))}
        {current && current.sections.length > 0 && (
          <>
            <p className="px-3 pb-1 pt-3 text-xs text-muted-foreground">{current.name} sections</p>
            {current.sections.map((s) => (
              <Link key={s.slug} href={`/${current.id}/${s.slug}`} onClick={close} aria-current={is(`/${current.id}/${s.slug}`)} className={`${row} pl-11`}>
                {s.label}
              </Link>
            ))}
          </>
        )}
      </div>
    </details>
  );
}
