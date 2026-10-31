import { AppArea } from "@/components/shell/app-area";

export default function PortfolioLayout({ children }: LayoutProps<"/portfolio">) {
  return <AppArea appId="portfolio">{children}</AppArea>;
}
