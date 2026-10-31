import { AppHome } from "@/components/placeholders";
import { getApp } from "@/lib/apps";

export default function HubHome() {
  return <AppHome app={getApp("hub")} note="Manage what the hub shows." />;
}
