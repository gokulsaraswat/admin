/**
 * The callback's `next` as a path on `origin`, else "/". Checks the resolved URL, not only the prefix:
 * the URL parser drops tabs and newlines, so "/\t/evil.com" would otherwise become "//evil.com".
 */
export function safeNext(value: string | null, origin: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/";
  try {
    const target = new URL(value, origin);
    return target.origin === origin ? `${target.pathname}${target.search}${target.hash}` : "/";
  } catch {
    return "/";
  }
}
