import assert from "node:assert/strict";
import { test } from "node:test";
import { safeNext } from "../src/app/auth/callback/safe-next.ts";

const origin = "https://admin.example.com";
const fromQuery = (raw) => safeNext(new URL(`${origin}/auth/callback?code=x&next=${raw}`).searchParams.get("next"), origin);

test("keeps same-origin paths", () => {
  assert.equal(fromQuery("/"), "/");
  assert.equal(fromQuery("/account"), "/account");
  assert.equal(fromQuery("/account?error=oauth"), "/account?error=oauth");
  assert.equal(fromQuery("%2Faccount%3Ferror%3Doauth"), "/account?error=oauth");
  assert.equal(fromQuery("/hub/config"), "/hub/config");
});

test("missing, empty or absolute values fall back to /", () => {
  assert.equal(safeNext(null, origin), "/");
  assert.equal(fromQuery(""), "/");
  assert.equal(fromQuery("https://evil.com"), "/");
  assert.equal(fromQuery("evil.com"), "/");
  assert.equal(fromQuery("javascript:alert(1)"), "/");
});

test("protocol-relative and backslash forms fall back to /", () => {
  for (const raw of ["//evil.com", "/%5Cevil.com", "%5C%5Cevil.com", "/%2F/evil.com"]) assert.equal(fromQuery(raw), "/", raw);
});

test("tab, CR and LF tricks the URL parser strips fall back to /", () => {
  for (const raw of ["/%09/evil.com", "/%0A/evil.com", "/%0D/evil.com", "/%09%5Cevil.com", "%2F%09%2Fevil.com", "/%09%09/evil.com"]) {
    assert.equal(fromQuery(raw), "/", raw);
  }
});

test("an invalid host or port after stripping does not throw", () => {
  assert.equal(fromQuery("/%09/evil.com:99999"), "/");
  assert.equal(fromQuery("/%09/%5B"), "/");
});

test("every result resolves on the same origin", () => {
  const inputs = ["/", "/account", "//evil.com", "/%09/evil.com", "/%0A%0D/x.y", "/%5C%09evil.com", "/.%09/evil.com", "/a/../../evil.com"];
  for (const raw of inputs) assert.equal(new URL(fromQuery(raw), origin).origin, origin, raw);
});
