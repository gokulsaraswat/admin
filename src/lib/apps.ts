import type { AppId } from "@gokulsaraswat/config";

export type ManagedAppId = Exclude<AppId, "admin">;

export interface AppSection {
  slug: string;
  label: string;
  /** What the section is for, shown on its page until it is built. */
  description: string;
}

export interface AppMeta {
  id: ManagedAppId;
  name: string;
  mark: string;
  /** False until the app has an admin area; its rail mark stays dimmed. */
  ready: boolean;
  sections: AppSection[];
}

/** Rail order. Colour per app: `--app-<id>` in globals.css (docs/DESIGN.md section 2). */
export const managedApps: readonly AppMeta[] = [
  {
    id: "portfolio",
    name: "Portfolio",
    mark: "P",
    ready: true,
    sections: [
      { slug: "posts", label: "Posts", description: "Ideas, drafts and published blog posts in one pipeline." },
      { slug: "projects", label: "Projects", description: "Projects with stack, diagrams, links and team." },
      { slug: "courses", label: "Courses", description: "Courses and their chapter trees, including linked posts and snippets." },
      { slug: "snippets", label: "Snippets", description: "Code snippets with tabs, demos and chatbot indexing." },
      { slug: "messages", label: "Messages", description: "Contact form inbox: read, replied, notes." },
      { slug: "comments", label: "Comments", description: "Visitor comments: edit or remove." },
      { slug: "chatbot", label: "Chatbot", description: "The site's AI assistant: on/off and what it knows." },
      { slug: "settings", label: "Site settings", description: "Profile, hero, appearance, features, SEO and footer." },
      { slug: "backup", label: "Backup", description: "Export and restore portfolio data, with a preview first." },
    ],
  },
  {
    id: "hub",
    name: "Hub",
    mark: "H",
    ready: true,
    sections: [{ slug: "config", label: "Config", description: "The hub's app tiles, published as config.json." }],
  },
  { id: "gspace", name: "GSpace", mark: "S", ready: false, sections: [] },
  { id: "studio", name: "Studio", mark: "M", ready: false, sections: [] },
  { id: "gym", name: "Gym", mark: "Y", ready: false, sections: [] },
];

export function getApp(id: ManagedAppId): AppMeta {
  const app = managedApps.find((a) => a.id === id);
  if (!app) throw new Error(`Unknown app ${id}`);
  return app;
}
