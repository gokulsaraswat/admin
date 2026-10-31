import type { ManagedAppId } from "@/lib/apps";

const bg: Record<ManagedAppId | "platform", string> = {
  platform: "bg-primary text-primary-foreground",
  portfolio: "bg-app-portfolio text-white",
  hub: "bg-app-hub text-white",
  gspace: "bg-app-gspace text-white",
  studio: "bg-app-studio text-black",
  gym: "bg-app-gym text-white",
};

interface AppMarkProps {
  app: ManagedAppId | "platform";
  letter: string;
  size?: "sm" | "md";
  dimmed?: boolean;
}

export function AppMark({ app, letter, size = "md", dimmed = false }: AppMarkProps) {
  const box = size === "sm" ? "size-5 rounded-sm text-[11px]" : "size-7 rounded-md text-[13px]";
  return (
    <span aria-hidden className={`grid shrink-0 place-items-center font-semibold ${box} ${bg[app]} ${dimmed ? "opacity-45" : ""}`}>
      {letter}
    </span>
  );
}
