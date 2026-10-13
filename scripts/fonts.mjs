import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";
import {
  fallbackOverrides,
  missingCodePoints,
  openFont,
  requiredCodePoints,
} from "./lib/fonts.mjs";

// Rigenera i font serviti dal sito a partire dagli originali in fonts-src/
// (vedi docs/adr/0010-font-pixel-operator-ibm-plex-sans.md):
// 1. subset woff2 di Pixel Operator (CC0) con i glifi di requiredCodePoints;
// 2. stampa i valori del fallback metrico da copiare in src/styles/fonts.css.
// IBM Plex Sans non si tocca: il sito usa i subset Latin1 ufficiali di IBM,
// identici alla release, perché un subset fatto qui sarebbe una versione
// modificata e non potrebbe usare il nome riservato "Plex" (OFL-FAQ 2.5-2.6).
// Uso: npm run fonts -- [percorso di un font compatibile con Arial]

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const fallbackPath =
  process.argv[2] ?? "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf";

const sample =
  "Gianpaolo Del Moro, Full Stack Developer in formazione a Pisa. File Modifica Visualizza Aiuto Salva Annulla Progetti Contatti Pannello di controllo";

/** @param {import("fontkit").Font} font */
function metrics(font) {
  return {
    unitsPerEm: font.unitsPerEm,
    ascent: font.ascent,
    descent: font.descent,
    lineGap: font.lineGap,
    averageWidth: font.layout(sample).advanceWidth / sample.length,
  };
}

const fallback = metrics(openFont(fallbackPath));

const pixelOperator = [
  ["PixelOperator.ttf", "pixel-operator-400.woff2"],
  ["PixelOperator-Bold.ttf", "pixel-operator-700.woff2"],
];

const subsets = await Promise.all(
  pixelOperator.map(async ([source = "", target = ""]) => {
    const sourcePath = resolve(root, "fonts-src/pixel-operator", source);
    const font = openFont(sourcePath);
    const available = requiredCodePoints().filter(
      (codePoint) => missingCodePoints(font, [codePoint]).length === 0,
    );
    const text = String.fromCodePoint(...available);
    const woff2 = await subsetFont(await readFile(sourcePath), text, { targetFormat: "woff2" });
    await writeFile(resolve(root, "src/assets/fonts", target), woff2);
    return `${target}: ${woff2.length} byte, ${available.length} glifi`;
  }),
);
subsets.forEach((line) => console.log(line));

const plexPath = resolve(root, "src/assets/fonts/IBMPlexSans-Regular-Latin1.woff2");
const sources = {
  "Pixel Operator": resolve(root, "fonts-src/pixel-operator/PixelOperator.ttf"),
  "IBM Plex Sans": plexPath,
};
for (const [family, path] of Object.entries(sources)) {
  const font = openFont(path);
  console.log(`${family} Fallback:`, fallbackOverrides(metrics(font), fallback));
}
