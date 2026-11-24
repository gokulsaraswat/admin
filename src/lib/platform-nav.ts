import type { Session } from "@/lib/session";

export interface NavItem {
  href: string;
  label: string;
}

/** Platform area pages the user may open. Shapes the UI only; RLS enforces access. */
export function platformLinks(session: Session | null): NavItem[] {
  const links: NavItem[] = [{ href: "/", label: "Overview" }];
  if (session?.superAdmin || session?.roles.some((r) => r.role === "admin")) {
    links.push({ href: "/access-requests", label: "Access requests" });
  }
  return links;
}
