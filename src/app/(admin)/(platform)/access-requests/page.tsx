import { loadAccessRequests } from "@/features/access-requests/load";
import { RequestsTable } from "@/features/access-requests/requests-table";
import { getSession } from "@/lib/session";

export default async function AccessRequests() {
  const [session, requests] = await Promise.all([getSession(), loadAccessRequests()]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6">
      <h1 className="text-xl font-semibold">Access requests</h1>
      <p className="mt-1 text-muted-foreground">
        People who signed in to an app and asked to join it. Approving adds them to that app; only a super admin can make someone an admin.
      </p>
      {requests.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center">
          <p className="font-medium">No requests</p>
          <p className="mt-1 text-sm text-muted-foreground">Requests for apps you admin show up here.</p>
        </div>
      ) : (
        <RequestsTable requests={requests} roles={session?.roles ?? []} superAdmin={session?.superAdmin ?? false} />
      )}
    </main>
  );
}
