import { hasRole } from "@gokulsaraswat/auth";
import type { UserRole } from "@gokulsaraswat/config";
import { DecideForm } from "./decide-form";
import type { AccessRequest } from "./types";

interface RequestsTableProps {
  requests: readonly AccessRequest[];
  roles: readonly UserRole[];
  superAdmin: boolean;
}

const statusStyle: Record<AccessRequest["status"], string> = {
  pending: "bg-accent text-foreground",
  approved: "bg-muted text-muted-foreground",
  denied: "bg-muted text-destructive",
};

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });
const columns = ["Email", "Name", "App", "Requested", "Status", "Created"];

export function RequestsTable({ requests, roles, superAdmin }: RequestsTableProps) {
  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border text-xs text-muted-foreground">
          <tr>
            {columns.map((c) => (
              <th key={c} scope="col" className="px-4 py-2 font-medium">{c}</th>
            ))}
            <th scope="col" className="px-4 py-2"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {requests.map((r) => {
            const canDecide = hasRole(roles, r.app, "admin") && (r.status !== "approved" || superAdmin);
            return (
              <tr key={r.id} className="align-middle">
                <td className="max-w-56 truncate px-4 py-3 font-medium" title={r.email}>{r.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.name ?? "-"}</td>
                <td className="px-4 py-3">{r.app}</td>
                <td className="px-4 py-3 capitalize">{r.requested_role}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-sm px-1.5 py-0.5 text-xs capitalize ${statusStyle[r.status]}`}>{r.status}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  <time dateTime={r.created_at}>{dateFormat.format(new Date(r.created_at))}</time>
                </td>
                <td className="px-4 py-3">{canDecide && <DecideForm request={r} canGrantAdmin={superAdmin} />}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
