import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const tokensCss = readFileSync(join(root, "src/styles/tokens.css"), "utf8");
const packageCss = readFileSync(join(root, "docs/design/gdm95/tokens.css"), "utf8");

const normalize = (value: string) => value.replace(/\s+/g, " ").replace(/\(\s+/g, "(").trim();

function declarations(css: string) {
  const result = new Map<string, Set<string>>();
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const match of withoutComments.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)) {
    const [, name = "", value = ""] = match;
    const values = result.get(name) ?? new Set<string>();
    values.add(normalize(value));
    result.set(name, values);
  }
  return result;
}

function filesUnder(dir: string, extension: string): string[] {
  return readdirSync(join(root, dir), { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => join(entry.parentPath, entry.name));
}

const projectFontStack = (value: string) =>
  value
    .replace("DotGothic16, ", '"Pixel Operator Fallback", ')
    .replace('"IBM Plex Sans", system-ui', '"IBM Plex Sans", "IBM Plex Sans Fallback", system-ui');

describe("tokens.css", () => {
  const ours = declarations(tokensCss);

  it("contiene ogni token del pacchetto GDM 95 con lo stesso valore, più le facce di fallback dei font", () => {
    const missing: string[] = [];
    for (const [name, values] of declarations(packageCss)) {
      for (const value of values) {
        if (!ours.get(name)?.has(projectFontStack(value))) missing.push(`${name}: ${value}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("non include il font sostitutivo delle anteprime", () => {
    expect(tokensCss).not.toMatch(/DotGothic/i);
  });

  it("definisce ogni variabile usata nei CSS di src", () => {
    const cssFiles = filesUnder("src", ".css");
    const defined = new Set<string>();
    const used = new Set<string>();
    for (const file of cssFiles) {
      const css = readFileSync(file, "utf8");
      for (const name of declarations(css).keys()) defined.add(name);
      for (const match of css.matchAll(/var\(\s*(--[\w-]+)/g)) used.add(match[1] ?? "");
    }
    for (const file of filesUnder("src", ".tsx")) {
      for (const match of readFileSync(file, "utf8").matchAll(/"(--[\w-]+)"\s*:/g)) {
        defined.add(match[1] ?? "");
      }
    }
    const forcedColorsOnly = ["--forced-border-width", "--forced-border-width-pressed"];
    forcedColorsOnly.forEach((name) => defined.add(name));
    expect([...used].filter((name) => !defined.has(name))).toEqual([]);
  });
});
