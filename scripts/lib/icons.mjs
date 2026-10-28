/**
 * Ruoli di colore delle icone GDM 95: ogni colore della tavolozza a 16 colori
 * diventa una classe del CSS Module di Icon, che legge --color-pixel-*.
 * #000000 è ambiguo: il primo path nero è il contorno (bianco in alto
 * contrasto), gli altri sono riempimenti neri (vedi docs/DESIGN_SYSTEM.md §7).
 */
export const colorRoles = /** @type {const} */ ({
  "#000000": "pixelBlack",
  "#ffffff": "pixelWhite",
  "#c0c0c0": "pixelSilver",
  "#808080": "pixelGray",
  "#000080": "pixelNavy",
  "#0000ff": "pixelBlue",
  "#008080": "pixelTeal",
  "#00ffff": "pixelCyan",
  "#ffff00": "pixelYellow",
  "#808000": "pixelOlive",
  "#ff0000": "pixelRed",
  "#800000": "pixelMaroon",
  "#008000": "pixelGreen",
  "#00ff00": "pixelLime",
  "#800080": "pixelPurple",
  "#ff8000": "pixelOrange",
  "#ffcc99": "pixelSkin",
});

/** @type {Map<string, string>} */
const roles = new Map(Object.entries(colorRoles));

/**
 * @typedef {{ size: number, paths: [string, string][] }} IconData
 */

/**
 * Legge un SVG del pacchetto GDM 95 e restituisce lato e path con il ruolo di colore.
 * @param {string} svg
 * @returns {IconData}
 */
export function parseIcon(svg) {
  const root = /^<svg ([^>]*)>/.exec(svg.trim());
  if (!root) throw new Error("SVG senza elemento radice <svg>");
  const attributes = root[1] ?? "";
  const viewBox = /viewBox="0 0 (\d+) (\d+)"/.exec(attributes);
  if (!viewBox || viewBox[1] !== viewBox[2]) throw new Error("viewBox quadrato mancante");
  if (!attributes.includes('shape-rendering="crispEdges"')) {
    throw new Error('shape-rendering="crispEdges" mancante');
  }
  const elements = [...svg.matchAll(/<(\w+)/g)].map((match) => match[1]);
  const unexpected = elements.filter((name) => name !== "svg" && name !== "path");
  if (unexpected.length > 0) throw new Error(`elementi non ammessi: ${unexpected.join(", ")}`);

  let outlineFound = false;
  /** @type {[string, string][]} */
  const paths = [...svg.matchAll(/<path fill="(#[0-9a-f]{6})" d="([^"]+)"(?:\/>|><\/path>)/g)].map(
    (match) => {
      const fill = match[1] ?? "";
      const d = match[2] ?? "";
      const role = roles.get(fill);
      if (!role) throw new Error(`colore fuori tavolozza: ${fill}`);
      if (fill === "#000000" && !outlineFound) {
        outlineFound = true;
        return ["pixelOutline", d];
      }
      return [role, d];
    },
  );
  if (paths.length !== elements.length - 1) throw new Error("path in formato non previsto");
  return { size: Number(viewBox[1]), paths };
}

/**
 * Converte una griglia di pixel (una stringa per riga) nei rettangoli di un
 * path SVG: una corsa orizzontale per ogni sequenza del carattere scelto.
 * @param {string[]} rows
 * @param {string} pixel
 * @returns {string}
 */
export function rowsToPath(rows, pixel) {
  /** @type {string[]} */
  const runs = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] !== pixel) {
        x += 1;
        continue;
      }
      let length = 0;
      while (row[x + length] === pixel) length += 1;
      runs.push(`M${x} ${y}h${length}v1h-${length}z`);
      x += length;
    }
  });
  return runs.join("");
}

/**
 * @param {Record<string, IconData>} icons
 * @returns {string}
 */
export function renderIconModule(icons) {
  /** @type {Record<string, Record<number, IconData>>} */
  const table = {};
  for (const key of Object.keys(icons).toSorted()) {
    const icon = icons[key];
    if (!icon) continue;
    const name = key.replace(/-\d+$/, "");
    table[name] = { ...table[name], [icon.size]: icon };
  }
  const sizes = Object.fromEntries(
    Object.entries(table).map(([name, bySize]) => [name, Object.keys(bySize).map(Number)]),
  );
  const entries = Object.entries(table).map(([name, bySize]) => {
    const variants = Object.values(bySize).map(
      (icon) => `    ${icon.size}: { size: ${icon.size}, paths: ${JSON.stringify(icon.paths)} },`,
    );
    return [`  ${name}: {`, ...variants, "  },"].join("\n");
  });
  return [
    "// File generato da scripts/icons.mjs a partire da src/assets/icons: non modificarlo a mano.",
    "",
    `export const iconSizes = ${JSON.stringify(sizes)} as const;`,
    "",
    "export type IconName = keyof typeof iconSizes;",
    "",
    "export type IconSize<Name extends IconName> = (typeof iconSizes)[Name][number];",
    "",
    `export const iconNames: readonly IconName[] = ${JSON.stringify(Object.keys(table))};`,
    "",
    "export type PixelRole =",
    ...["pixelOutline", ...Object.values(colorRoles)].map((role) => `  | ${JSON.stringify(role)}`),
    "  ;",
    "",
    "export type IconData = { size: number; paths: ReadonlyArray<readonly [PixelRole, string]> };",
    "",
    "export type IconTable = {",
    "  readonly [Name in IconName]: Readonly<Record<IconSize<Name>, IconData>>;",
    "};",
    "",
    "export const icons: IconTable = {",
    ...entries,
    "};",
    "",
  ].join("\n");
}

/**
 * @param {Record<string, string[]>} glyphs
 * @param {string[]} radioRows
 * @returns {string}
 */
export function renderGlyphModule(glyphs, radioRows) {
  const names = Object.keys(glyphs).toSorted();
  const entries = names.map((name) => {
    const rows = glyphs[name] ?? [];
    const width = rows[0]?.length ?? 0;
    return `  ${name}: { width: ${width}, height: ${rows.length}, path: ${JSON.stringify(rowsToPath(rows, "X"))} },`;
  });
  const radioParts = {
    shadow: "s",
    shadowDark: "k",
    highlight: "w",
    surfaceLight: "l",
    field: "f",
    dot: "D",
  };
  const radio = Object.entries(radioParts).map(
    ([part, pixel]) => `    ${part}: ${JSON.stringify(rowsToPath(radioRows, pixel))},`,
  );
  return [
    "// File generato da scripts/icons.mjs a partire da src/components/Icon/glyphs.json: non modificarlo a mano.",
    "",
    `export const glyphNames = ${JSON.stringify(names)} as const;`,
    "",
    "export type GlyphName = (typeof glyphNames)[number];",
    "",
    "export const glyphs: Readonly<Record<GlyphName, { width: number; height: number; path: string }>> = {",
    ...entries,
    "};",
    "",
    "export const radioCircle = {",
    `  size: ${radioRows.length},`,
    "  parts: {",
    ...radio,
    "  },",
    "} as const;",
    "",
  ].join("\n");
}
