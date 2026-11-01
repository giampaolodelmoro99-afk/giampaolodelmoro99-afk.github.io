import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import { beforeAll, describe, expect, it } from "vitest";
import { inlineScriptHashes } from "../../scripts/lib/csp.mjs";

// Richiede la build completa (`npm run build`, che costruisce anche Storybook).
// Durante il lavoro basta `npm run build:site` con `npm run test:prerender:site`.

const storybook = join(import.meta.dirname, "../../build/client/storybook");

beforeAll(() => {
  if (!existsSync(storybook)) {
    throw new Error("build/client/storybook non trovato: esegui `npm run build`");
  }
});

async function load(file: string) {
  const html = await readFile(file, "utf8");
  return { html, document: new JSDOM(html).window.document };
}

function attr(document: Document, selector: string, name: string): string | null {
  return document.querySelector(selector)?.getAttribute(name) ?? null;
}

describe("Storybook in /storybook/", () => {
  it.each(["index.html", "iframe.html"])(
    "%s non è indicizzabile e ha una CSP dedicata come primo elemento di head",
    async (name) => {
      const { html, document } = await load(join(storybook, name));
      expect(attr(document, 'meta[name="robots"]', "content")).toBe("noindex, nofollow");
      expect(html).toMatch(/<head><meta http-equiv="Content-Security-Policy"/);
      const policy = attr(document, 'meta[http-equiv="Content-Security-Policy"]', "content") ?? "";
      for (const hash of inlineScriptHashes(html)) {
        expect(policy).toContain(hash);
      }
      expect(policy).not.toMatch(/unsafe-eval|https?:/);
      expect(policy).not.toMatch(/script-src[^;]*unsafe-inline/);
      expect(html.indexOf("<meta charset")).toBeGreaterThan(0);
      expect(html.indexOf("<meta charset")).toBeLessThan(1024);
    },
  );

  it("non pubblica project.json con le dipendenze di sviluppo", () => {
    expect(existsSync(join(storybook, "project.json"))).toBe(false);
  });
});
