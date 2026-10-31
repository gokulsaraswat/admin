import { Sidebar } from "@/components/shell/sidebar";

export default function PlatformLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Sidebar title="Platform" app="platform" mark="G" links={[{ href: "/", label: "Overview" }]} />
      <div className="min-w-0 flex-1 overflow-auto">{children}</div>
    </>
  );
}
