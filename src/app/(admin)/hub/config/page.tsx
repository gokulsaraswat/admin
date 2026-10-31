import { HubConfigEditor } from "@/features/hub/config/editor";
import { loadHubConfig } from "@/features/hub/config/load";

export default async function HubConfig() {
  const { canEdit, config, problem, publicUrl } = await loadHubConfig();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6">
      <h1 className="text-xl font-semibold">Config</h1>
      <p className="mt-1 text-muted-foreground">The app tiles the hub shows, in order. Publishing replaces the hub&apos;s config.json.</p>
      {!canEdit ? (
        <p className="mt-6 rounded-lg border border-border p-4 text-sm">
          You need the Config permission for Hub to edit tiles. Ask a Hub admin or a super admin.
        </p>
      ) : (
        <>
          {problem && (
            <p role="alert" className="mt-6 rounded-lg border border-destructive/40 p-4 text-sm text-destructive">
              The published config.json is invalid ({problem}). The editor starts empty; publishing replaces that file.
            </p>
          )}
          <HubConfigEditor initial={config} publicUrl={publicUrl} />
        </>
      )}
    </main>
  );
}
