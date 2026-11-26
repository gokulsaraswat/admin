export default function AdminLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      <div className="h-6 w-48 animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
      <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
      <div className="mt-6 space-y-3">
        <div className="h-12 animate-pulse rounded-lg bg-muted motion-reduce:animate-none" />
        <div className="h-12 animate-pulse rounded-lg bg-muted motion-reduce:animate-none" />
        <div className="h-12 animate-pulse rounded-lg bg-muted motion-reduce:animate-none" />
      </div>
    </main>
  );
}
