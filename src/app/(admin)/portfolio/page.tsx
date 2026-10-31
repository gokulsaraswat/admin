import { AppHome } from "@/components/placeholders";
import { getApp } from "@/lib/apps";

export default function PortfolioHome() {
  return <AppHome app={getApp("portfolio")} note="Sections fill in after the portfolio data moves to the new database." />;
}
