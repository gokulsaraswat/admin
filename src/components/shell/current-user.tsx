import { signOut } from "@/app/login/actions";

interface CurrentUserProps {
  email: string;
  superAdmin: boolean;
}

export function CurrentUser({ email, superAdmin }: CurrentUserProps) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-sm">
      <span className="min-w-0 truncate text-muted-foreground" title={email}>
        {email || "Signed in"}
        {superAdmin && <span className="ml-1.5 rounded-sm bg-sidebar-accent px-1.5 py-0.5 text-xs text-foreground">Super admin</span>}
      </span>
      <form action={signOut} className="shrink-0">
        <button type="submit" className="h-8 rounded-md px-2 hover:bg-sidebar-accent">
          Sign out
        </button>
      </form>
    </div>
  );
}
