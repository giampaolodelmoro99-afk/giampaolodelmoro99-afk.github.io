import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { prepareStorybookHtml, robotsMeta, storybookCsp } from "./storybook.mjs";

/** @param {string} source */
const sha = (source) => `'sha256-${createHash("sha256").update(source, "utf8").digest("base64")}'`;

/** @param {string} head @param {string} [body] */
const page = (head, body = "") =>
  `<!doctype html><html><head>${head}</head><body>${body}</body></html>`;

describe("storybookCsp", () => {
  it("permette solo lo stesso sito, gli hash degli script inline e gli stili inline", () => {
    const policy = storybookCsp(["'sha256-abc'"]);
    expect(policy).toContain("script-src 'self' 'sha256-abc'");
    expect(policy).toContain("style-src 'self' 'unsafe-inline'");
    expect(policy).toContain("frame-src 'self'");
    expect(policy).toContain("object-src 'none'");
    expect(policy).not.toMatch(/unsafe-eval|https?:/);
    expect(policy).not.toMatch(/script-src[^;]*unsafe-inline/);
  });
});

describe("prepareStorybookHtml", () => {
  it("inserisce la CSP come primo elemento di head, con l'hash degli script inline", () => {
    const html = page(
      `<script type="module" src="./a.js"></script>${robotsMeta}<script>boot()</script>`,
    );
    const result = prepareStorybookHtml(html, "iframe.html");
    expect(result).toMatch(
      /<head><meta http-equiv="Content-Security-Policy" content="[^"]+" \/><script/,
    );
    expect(result).toContain(sha("boot()"));
  });

  it.each([
    ["senza meta robots", page("<title>x</title>"), "noindex"],
    [
      "con uno script esterno",
      page(`${robotsMeta}<script src="https://cdn.example/x.js"></script>`),
      "esterna",
    ],
    [
      "con uno script esterno tra apici singoli",
      page(`${robotsMeta}<script src='https://cdn.example/x.js'></script>`),
      "esterna",
    ],
    [
      "con uno script esterno senza virgolette",
      page(`${robotsMeta}<script src=//cdn.example/x.js></script>`),
      "esterna",
    ],
    [
      "con un foglio di stile esterno",
      page(`${robotsMeta}<link rel="stylesheet" href="//cdn.example/x.css">`),
      "esterna",
    ],
    [
      "con una CSP già presente",
      page(`${robotsMeta}<meta http-equiv="Content-Security-Policy" content="x">`),
      "già presente",
    ],
    ["senza head", `<html>${robotsMeta}</html>`, "<head>"],
  ])("rifiuta un documento %s", (_case, html, message) => {
    expect(() => prepareStorybookHtml(html, "index.html")).toThrow(message);
  });

  it("ammette i link testuali verso siti esterni, che non caricano risorse", () => {
    const html = page(robotsMeta, '<a href="https://storybook.js.org/docs">Documentazione</a>');
    expect(() => prepareStorybookHtml(html, "iframe.html")).not.toThrow();
  });
});
