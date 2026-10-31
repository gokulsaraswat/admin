"use client";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-lg font-semibold">This page couldn&apos;t load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Your access or data could not be read. Check your connection and try again.</p>
        <button type="button" onClick={reset} className="mt-6 h-10 rounded-md bg-primary px-4 font-medium text-primary-foreground hover:opacity-90">
          Try again
        </button>
      </div>
    </main>
  );
}
