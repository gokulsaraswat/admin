import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in · Admin" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-md bg-primary font-semibold text-primary-foreground">G</span>
          <div>
            <h1 className="text-lg font-semibold">Admin</h1>
            <p className="text-sm text-muted-foreground">Sign in to manage your apps.</p>
          </div>
        </div>
        <LoginForm />
        <p className="mt-6 text-xs text-muted-foreground">Accounts are invite-only. Ask a super admin for access.</p>
      </div>
    </main>
  );
}
