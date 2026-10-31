import { AppArea } from "@/components/shell/app-area";

export default function HubLayout({ children }: LayoutProps<"/hub">) {
  return <AppArea appId="hub">{children}</AppArea>;
}
