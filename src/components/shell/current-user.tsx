import Link from "next/link";
import { signOut } from "@/app/login/actions";

interface CurrentUserProps {
  email: string;
  superAdmin: boolean;
  /** Email links to /account (Connected accounts). Off where the shell's pages are not reachable. */
  accountLink?: boolean;
}

export function CurrentUser({ email, superAdmin, accountLink = true }: CurrentUserProps) {
  const label = (
    <>
      {email || "Signed in"}
      {superAdmin && <span className="ml-1.5 rounded-sm bg-sidebar-accent px-1.5 py-0.5 text-xs text-foreground">Super admin</span>}
    </>
  );
  return (
    <div className="flex min-w-0 items-center gap-2 text-sm">
      {accountLink ? (
        <Link href="/account" title={`${email} · Connected accounts`} className="min-w-0 truncate rounded-sm text-muted-foreground hover:text-foreground hover:underline">
          {label}
        </Link>
      ) : (
        <span className="min-w-0 truncate text-muted-foreground" title={email}>
          {label}
        </span>
      )}
      <form action={signOut} className="shrink-0">
        <button type="submit" className="h-8 rounded-md px-2 hover:bg-sidebar-accent">
          Sign out
        </button>
      </form>
    </div>
  );
}
