import { EmptySection } from "@/components/placeholders";
import { getApp } from "@/lib/apps";

export default function HubConfig() {
  const [config] = getApp("hub").sections;
  return <EmptySection section={config} note="Built in the next step: edit tiles, then publish to public-config/hub/config.json." />;
}
