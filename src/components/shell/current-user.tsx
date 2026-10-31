import { signOut } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";

export async function CurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims.email === "string" ? data.claims.email : "Signed in";

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="truncate text-muted-foreground" title={email}>
        {email}
      </span>
      <form action={signOut}>
        <button type="submit" className="h-8 rounded-md px-2 hover:bg-sidebar-accent">
          Sign out
        </button>
      </form>
    </div>
  );
}
