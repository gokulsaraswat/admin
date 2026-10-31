"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  className: string;
  /** Match child paths too (rail: /portfolio is current on /portfolio/posts). */
  prefix?: boolean;
  title?: string;
  children: ReactNode;
}

export function NavLink({ href, className, prefix = false, title, children }: NavLinkProps) {
  const pathname = usePathname();
  const current = pathname === href || (prefix && href !== "/" && pathname.startsWith(`${href}/`));
  return (
    <Link href={href} title={title} aria-current={current ? "page" : undefined} className={className}>
      {children}
    </Link>
  );
}
