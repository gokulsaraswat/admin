import { Suspense } from "react";
import { AppMark } from "@/components/app-mark";
import { CurrentUser } from "@/components/shell/current-user";
import { Rail } from "@/components/shell/rail";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 md:h-dvh">
      <Rail />
      <nav aria-label="Platform" className="hidden w-56 flex-col gap-0.5 border-r border-sidebar-border bg-sidebar px-2.5 py-3.5 text-sidebar-foreground md:flex">
        <h2 className="mx-2 mb-3 flex items-center gap-2 font-semibold">
          <AppMark app="platform" letter="G" size="sm" /> Platform
        </h2>
        <span aria-current="page" className="flex h-8 items-center rounded-md bg-sidebar-accent px-2 text-sm font-medium">
          Overview
        </span>
        <span className="flex-1" />
        <Suspense fallback={<div className="h-8 animate-pulse rounded-md bg-sidebar-accent" />}>
          <CurrentUser />
        </Suspense>
      </nav>
      <div className="flex min-w-0 flex-1 flex-col overflow-auto">
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-background px-4 py-2.5 md:hidden">
          <AppMark app="platform" letter="G" size="sm" />
          <b className="flex-1">Admin</b>
          <ThemeToggle />
          <Suspense fallback={null}>
            <CurrentUser />
          </Suspense>
        </div>
        {children}
      </div>
    </div>
  );
}
