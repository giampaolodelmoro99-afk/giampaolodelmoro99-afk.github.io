import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { generatedModules } from "./icon-sources.mjs";
import {
  colorRoles,
  parseIcon,
  renderGlyphModule,
  renderIconSprite,
  rowsToPath,
} from "./icons.mjs";

/** @param {string} body @param {string} [attributes] */
const svg = (body, attributes = 'viewBox="0 0 16 16" shape-rendering="crispEdges"') =>
  `<svg xmlns="http://www.w3.org/2000/svg" ${attributes}>${body}</svg>`;

describe("parseIcon", () => {
  it("assegna il ruolo di contorno al primo path nero e di riempimento agli altri", () => {
    const icon = parseIcon(
      svg(
        '<path fill="#000000" d="M0 0h1v1h-1z"/><path fill="#000080" d="M1 1h1v1h-1z"/><path fill="#000000" d="M2 2h1v1h-1z"/>',
      ),
    );
    expect(icon).toEqual({
      size: 16,
      paths: [
        ["pixelOutline", "M0 0h1v1h-1z"],
        ["pixelNavy", "M1 1h1v1h-1z"],
        ["pixelBlack", "M2 2h1v1h-1z"],
      ],
    });
  });

  it("accetta i path chiusi con il tag di chiusura (icone del pacchetto F2A)", () => {
    const icon = parseIcon(
      svg('<path fill="#000000" d="M0 0h1v1h-1z"></path><path fill="#ffffff" d="M1 1h1v1h-1z"/>'),
    );
    expect(icon.paths).toEqual([
      ["pixelOutline", "M0 0h1v1h-1z"],
      ["pixelWhite", "M1 1h1v1h-1z"],
    ]);
  });

  it.each([
    ["un colore fuori tavolozza", svg('<path fill="#123456" d="M0 0h1v1h-1z"/>'), "tavolozza"],
    ["un elemento diverso da path", svg('<rect width="1" height="1"/>'), "non ammessi"],
    [
      "un viewBox non quadrato",
      svg("", 'viewBox="0 0 16 8" shape-rendering="crispEdges"'),
      "viewBox",
    ],
    ["senza crispEdges", svg("", 'viewBox="0 0 16 16"'), "crispEdges"],
    ["senza radice svg", "<path/>", "radice"],
    ["un path in formato inatteso", svg('<path d="M0 0h1v1h-1z" fill="#000000"/>'), "formato"],
  ])("rifiuta %s", (_case, source, message) => {
    expect(() => parseIcon(source)).toThrow(message);
  });
});

describe("rowsToPath", () => {
  it("unisce i pixel consecutivi di ogni riga in un rettangolo", () => {
    expect(rowsToPath(["XX.X", ".X.."], "X")).toBe("M0 0h2v1h-2zM3 0h1v1h-1zM1 1h1v1h-1z");
  });

  it("restituisce un path vuoto se il pixel non compare", () => {
    expect(rowsToPath(["...."], "X")).toBe("");
  });
});

describe("renderIconSprite", () => {
  it("crea un simbolo per icona con il contorno in currentColor e i riempimenti della tavolozza", () => {
    const sprite = renderIconSprite({
      "cv-16": {
        size: 16,
        paths: [
          ["pixelOutline", "M0 0h1v1h-1z"],
          ["pixelNavy", "M1 1h1v1h-1z"],
        ],
      },
    });
    expect(sprite).toContain(
      '<symbol id="cv-16" viewBox="0 0 16 16"><path fill="currentColor" d="M0 0h1v1h-1z"/><path fill="#000080" d="M1 1h1v1h-1z"/></symbol>',
    );
    expect(sprite).not.toMatch(/<style|style=/);
  });

  it("rifiuta un ruolo senza colore", () => {
    expect(() =>
      renderIconSprite({ "cv-16": { size: 16, paths: [["pixelNone", "M0 0z"]] } }),
    ).toThrow("ruolo senza colore");
  });

  it("usa per i riempimenti gli stessi colori dei token --color-pixel-*, uguali nei due temi", async () => {
    const tokens = await readFile(
      resolve(import.meta.dirname, "../../src/styles/tokens.css"),
      "utf8",
    );
    for (const [hex, role] of Object.entries(colorRoles)) {
      const name = `--color-pixel-${role.slice(5).toLowerCase()}`;
      const values = [...tokens.matchAll(new RegExp(`${name}:\\s*([^;]+);`, "g"))].map((match) =>
        match[1]?.trim(),
      );
      expect(values.filter((value) => value?.startsWith("#"))).toEqual([hex]);
    }
  });
});

describe("renderGlyphModule", () => {
  it("elenca i glifi in ordine e scompone il cerchio del radio per tinta", () => {
    const source = renderGlyphModule({ up: ["X"], check: ["XX"] }, ["sk", "wD"]);
    expect(source).toContain('export const glyphNames = ["check","up"] as const;');
    expect(source).toContain('check: { width: 2, height: 1, path: "M0 0h2v1h-2z" },');
    expect(source).toContain('shadowDark: "M1 0h1v1h-1z",');
    expect(source).toContain('dot: "M1 1h1v1h-1z",');
  });
});

describe("moduli generati", () => {
  it("iconData.ts, glyphData.ts, lo sprite e le classi dei glifi sono allineati alle sorgenti (npm run icons)", async () => {
    const root = resolve(import.meta.dirname, "../..");
    const expected = await generatedModules(root);
    const actual = Object.fromEntries(
      await Promise.all(
        Object.keys(expected).map(async (path) => [
          path,
          await readFile(resolve(root, path), "utf8"),
        ]),
      ),
    );
    expect(actual).toEqual(expected);
  });
});
