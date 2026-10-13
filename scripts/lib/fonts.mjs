import { openSync } from "fontkit";

/**
 * Glifi richiesti a ogni font del sito (ADR-0010, DESIGN_SYSTEM.md §4):
 * Basic Latin, Latin-1 (accentate italiane, « »), virgolette e apostrofo
 * tipografici, – —, …, €, • e ×.
 */
export const requiredRanges = [
  [0x20, 0x7e],
  [0xa0, 0xff],
  [0x2013, 0x2014],
  [0x2018, 0x2019],
  [0x201c, 0x201d],
  [0x2022, 0x2022],
  [0x2026, 0x2026],
  [0x20ac, 0x20ac],
];

/**
 * Glifi che devono esserci per forza in ogni font: à è é ì ò ù, À È É Ì Ò Ù,
 * « », ‘ ’ “ ”, – —, …, €, •, ×.
 */
export const essentialCodePoints = [
  0xe0, 0xe8, 0xe9, 0xec, 0xf2, 0xf9, 0xc0, 0xc8, 0xc9, 0xcc, 0xd2, 0xd9, 0xab, 0xbb, 0x2018,
  0x2019, 0x201c, 0x201d, 0x2013, 0x2014, 0x2026, 0x20ac, 0x2022, 0xd7,
];

/**
 * Apre un singolo font (non una collezione) con fontkit.
 * @param {string} path
 * @returns {import("fontkit").Font}
 */
export function openFont(path) {
  const font = openSync(path);
  if ("fonts" in font) {
    throw new Error(`${path}: attesa un singolo font, trovata una collezione`);
  }
  return font;
}

/** @returns {number[]} */
export function requiredCodePoints() {
  return requiredRanges.flatMap(([from = 0, to = 0]) =>
    Array.from({ length: to - from + 1 }, (_, index) => from + index),
  );
}

/**
 * @param {{ hasGlyphForCodePoint(codePoint: number): boolean }} font
 * @param {number[]} codePoints
 * @returns {number[]}
 */
export function missingCodePoints(font, codePoints) {
  return codePoints.filter((codePoint) => !font.hasGlyphForCodePoint(codePoint));
}

/**
 * Metriche verticali e larghezza media (in unità del font) di un font.
 * @typedef {{ unitsPerEm: number, ascent: number, descent: number, lineGap: number, averageWidth: number }} FontMetrics
 */

/**
 * @param {number} value
 * @returns {string}
 */
const percent = (value) => `${(value * 100).toFixed(2)}%`;

/**
 * Valori del fallback metrico per @font-face: il font di sistema viene
 * scalato per occupare lo stesso spazio del webfont, così lo swap non
 * sposta il layout (CLS 0).
 * @param {FontMetrics} font
 * @param {FontMetrics} fallback
 */
export function fallbackOverrides(font, fallback) {
  const sizeAdjust =
    font.averageWidth / font.unitsPerEm / (fallback.averageWidth / fallback.unitsPerEm);
  const relative = (/** @type {number} */ value) => value / font.unitsPerEm / sizeAdjust;
  return {
    sizeAdjust: percent(sizeAdjust),
    ascentOverride: percent(relative(font.ascent)),
    descentOverride: percent(relative(Math.abs(font.descent))),
    lineGapOverride: percent(relative(font.lineGap)),
  };
}
