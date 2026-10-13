import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generatedModules } from "./lib/icon-sources.mjs";

// Rigenera i dati delle icone e dei glifi usati dai componenti Icon e Glyph
// (src/components/Icon/iconData.ts e glyphData.ts) a partire dagli SVG in
// src/assets/icons e da src/components/Icon/glyphs.json.
// Un test fallisce se i file generati non sono allineati alle sorgenti.

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

await Promise.all(
  Object.entries(await generatedModules(root)).map(async ([path, source]) => {
    await writeFile(resolve(root, path), source);
    console.log(`scritto ${path}`);
  }),
);
