import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { buildCsp, inlineScriptHashes } from "./csp.mjs";

/** @param {string} source */
function sha(source) {
  return `'sha256-${createHash("sha256").update(source, "utf8").digest("base64")}'`;
}

describe("inlineScriptHashes", () => {
  it("calcola l'hash dei soli script inline eseguibili", () => {
    const html = [
      "<script>a()</script>",
      '<script type="module">b()</script>',
      '<script id="x">c()</script>',
      '<script type="application/ld+json">{"a":1}</script>',
      '<script src="/app.js"></script>',
      '<script type="module" src="/mod.js"></script>',
    ].join("");
    expect(inlineScriptHashes(html)).toEqual([sha("a()"), sha("b()"), sha("c()")]);
  });

  it("non duplica gli hash di script identici", () => {
    expect(inlineScriptHashes("<script>a()</script><script>a()</script>")).toHaveLength(1);
  });
});

describe("buildCsp", () => {
  it("chiude tutte le origini esterne e aggiunge gli hash a script-src", () => {
    const csp = buildCsp(["'sha256-abc'"]);
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("script-src 'self' 'sha256-abc'");
    expect(csp).toContain("style-src 'self';");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toContain("unsafe-inline");
  });

  it("lascia solo 'self' in script-src senza script inline", () => {
    expect(buildCsp([])).toContain("script-src 'self';");
  });
});
