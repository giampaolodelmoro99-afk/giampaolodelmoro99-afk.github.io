import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { format } from "prettier";
import { parseIcon, renderGlyphModule, renderIconModule } from "./icons.mjs";

export const iconModulePath = "src/components/Icon/iconData.ts";
export const glyphModulePath = "src/components/Icon/glyphData.ts";

/**
 * Legge le sorgenti (SVG e glyphs.json) e restituisce il contenuto dei moduli
 * generati, già formattato con Prettier.
 * @param {string} root
 * @returns {Promise<Record<string, string>>}
 */
export async function generatedModules(root) {
  const iconDir = resolve(root, "src/assets/icons");
  const files = (await readdir(iconDir)).filter((file) => file.endsWith(".svg")).toSorted();
  const icons = Object.fromEntries(
    await Promise.all(
      files.map(async (file) => [
        file.replace(/\.svg$/, ""),
        parseIcon(await readFile(resolve(iconDir, file), "utf8")),
      ]),
    ),
  );

  /** @type {{ glyphs: Record<string, string[]>, radio: { rows: string[] } }} */
  const glyphSource = JSON.parse(
    await readFile(resolve(root, "docs/design/gdm95/components/Icon/glyphs.json"), "utf8"),
  );

  const options = { parser: "typescript", printWidth: 100 };
  return {
    [iconModulePath]: await format(renderIconModule(icons), options),
    [glyphModulePath]: await format(
      renderGlyphModule(glyphSource.glyphs, glyphSource.radio.rows),
      options,
    ),
  };
}
