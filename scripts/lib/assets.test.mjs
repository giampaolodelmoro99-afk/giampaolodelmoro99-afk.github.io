import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { auditAssets, mediaExtensions, registeredAssets, sha256 } from "./assets.mjs";

const root = resolve(import.meta.dirname, "../..");
const hash = "a".repeat(64);

describe("registeredAssets", () => {
  it("legge percorso e SHA-256 dalle righe delle tabelle", () => {
    const markdown = [
      "| Nome | File | SHA-256 |",
      "| --- | --- | --- |",
      `| Icona | \`public/a.svg\` | \`${hash}\` |`,
      `- _Dismesso_ (\`public/b.svg\`, SHA-256 \`${hash}\`)`,
      "| Senza hash | `public/c.svg` | da registrare |",
    ].join("\n");
    expect([...registeredAssets(markdown)]).toEqual([["public/a.svg", hash]]);
  });

  it("rifiuta un file registrato due volte", () => {
    const row = `| Icona | \`public/a.svg\` | \`${hash}\` |`;
    expect(() => registeredAssets(`${row}\n${row}`)).toThrow("registrato due volte");
  });
});

describe("mediaExtensions", () => {
  it("riconosce i file multimediali ma non i file di testo di public", () => {
    expect(mediaExtensions.test("public/favicon.svg")).toBe(true);
    expect(mediaExtensions.test("public/og/it.png")).toBe(true);
    expect(mediaExtensions.test("public/robots.txt")).toBe(false);
  });
});

describe("sha256", () => {
  it("calcola l'impronta esadecimale", () => {
    expect(sha256(Buffer.from(""))).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
  });
});

describe("docs/ASSETS.md", () => {
  it("registra ogni asset del repo con lo SHA-256 corretto, e niente di più", async () => {
    const registered = registeredAssets(await readFile(resolve(root, "docs/ASSETS.md"), "utf8"));
    expect(await auditAssets(root, registered)).toEqual({
      unregistered: [],
      missing: [],
      mismatched: [],
    });
  });

  it("segnala un file non registrato, uno assente e uno con SHA-256 diverso", async () => {
    const registered = registeredAssets(await readFile(resolve(root, "docs/ASSETS.md"), "utf8"));
    registered.delete("public/favicon.svg");
    registered.set("public/inesistente.svg", hash);
    registered.set("src/assets/icons/about-16.svg", hash);
    expect(await auditAssets(root, registered)).toEqual({
      unregistered: ["public/favicon.svg"],
      missing: ["public/inesistente.svg"],
      mismatched: ["src/assets/icons/about-16.svg"],
    });
  });
});
