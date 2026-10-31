import { Suspense } from "react";
import { Shell, ShellFallback } from "@/components/shell/shell";

export default function AdminLayout({ children }: LayoutProps<"/">) {
  return (
    <Suspense fallback={<ShellFallback />}>
      <Shell>{children}</Shell>
    </Suspense>
  );
}
