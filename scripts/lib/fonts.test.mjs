import { readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  essentialCodePoints,
  fallbackOverrides,
  missingCodePoints,
  openFont,
  requiredCodePoints,
} from "./fonts.mjs";

const fonts = "src/assets/fonts";
const served = [
  "pixel-operator-400.woff2",
  "pixel-operator-700.woff2",
  "IBMPlexSans-Regular-Latin1.woff2",
  "IBMPlexSans-Bold-Latin1.woff2",
  "IBMPlexSans-Italic-Latin1.woff2",
];

/** @param {string} file */
const open = (file) => openFont(`${fonts}/${file}`);

describe("requiredCodePoints", () => {
  it("comprende Latin-1, i segni tipografici e l'euro", () => {
    const codePoints = requiredCodePoints();
    expect(codePoints).toContain(0x41);
    expect(codePoints).toContain(0xe0);
    expect(codePoints).toContain(0x2019);
    expect(codePoints).toContain(0x2026);
    expect(codePoints).toContain(0x20ac);
    expect(codePoints).not.toContain(0x7f);
    expect(new Set(codePoints).size).toBe(codePoints.length);
  });
});

describe("openFont", () => {
  it("rifiuta un file che non è un font", () => {
    expect(() => openFont("package.json")).toThrow("Unknown font format");
  });
});

describe("missingCodePoints", () => {
  it("elenca i code point senza glifo", () => {
    const font = { hasGlyphForCodePoint: (/** @type {number} */ cp) => cp !== 0x20ac };
    expect(missingCodePoints(font, [0x41, 0x20ac])).toEqual([0x20ac]);
  });
});

describe("fallbackOverrides", () => {
  it("scala il fallback sulla larghezza media e riporta le metriche verticali", () => {
    const font = { unitsPerEm: 1000, ascent: 800, descent: -200, lineGap: 100, averageWidth: 500 };
    const fallback = { unitsPerEm: 2000, ascent: 0, descent: 0, lineGap: 0, averageWidth: 1250 };
    expect(fallbackOverrides(font, fallback)).toEqual({
      sizeAdjust: "80.00%",
      ascentOverride: "100.00%",
      descentOverride: "25.00%",
      lineGapOverride: "12.50%",
    });
  });
});

describe("font serviti dal sito", () => {
  it.each(served)("%s contiene le lettere accentate e i segni tipografici", (file) => {
    expect(missingCodePoints(open(file), essentialCodePoints).map((cp) => cp.toString(16))).toEqual(
      [],
    );
  });

  it.each(served.filter((file) => file.startsWith("IBMPlexSans")))(
    "%s copre tutti i glifi richiesti",
    (file) => {
      expect(missingCodePoints(open(file), requiredCodePoints())).toEqual([]);
    },
  );

  it("i due pesi di Pixel Operator in preload restano sotto i 25 kB in tutto", () => {
    const preloaded = ["pixel-operator-400.woff2", "pixel-operator-700.woff2"];
    const total = preloaded.reduce((sum, file) => sum + statSync(`${fonts}/${file}`).size, 0);
    expect(total).toBeLessThanOrEqual(25 * 1024);
  });

  it("i file sono woff2", () => {
    for (const file of served) {
      expect(readFileSync(`${fonts}/${file}`).subarray(0, 4).toString("latin1")).toBe("wOF2");
    }
  });
});
