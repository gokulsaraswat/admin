import { Sidebar } from "@/components/shell/sidebar";
import { platformLinks } from "@/lib/platform-nav";
import { getSession } from "@/lib/session";

export default async function PlatformLayout({ children }: LayoutProps<"/">) {
  const session = await getSession();
  return (
    <>
      <Sidebar title="Platform" app="platform" mark="G" links={platformLinks(session)} />
      <div className="min-w-0 flex-1 overflow-auto">{children}</div>
    </>
  );
}
