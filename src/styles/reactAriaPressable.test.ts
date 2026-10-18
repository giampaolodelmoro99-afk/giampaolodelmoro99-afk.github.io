import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { pressableStyleId } from "./reactAriaPressable";

const require = createRequire(import.meta.url);
const reactAriaRoot = join(require.resolve("react-aria/package.json"), "..");
const usePressSource = readFileSync(
  join(reactAriaRoot, "dist/private/interactions/usePress.mjs"),
  "utf8",
);
const globalCss = readFileSync(join(import.meta.dirname, "global.css"), "utf8");

const constant = (name: string) =>
  new RegExp(`\\$var\\$${name} = '([^']+)';`).exec(usePressSource)?.[1];

const compact = (css: string) => css.replace(/\s+/g, " ").trim();

describe("stile di usePress di React Aria (ADR-0012)", () => {
  it("React Aria salta l'iniezione se trova un elemento con il nostro id sentinella", () => {
    expect(constant("STYLE_ID")).toBe(pressableStyleId);
    expect(usePressSource).toMatch(/getElementById\(\$\w+\$var\$STYLE_ID\)\) return;/);
  });

  it("global.css contiene la stessa regola che React Aria inserirebbe", () => {
    const attribute = constant("PRESSABLE_ATTRIBUTE");
    const template = /style\.textContent = `([\s\S]*?)`\.trim\(\);/.exec(usePressSource)?.[1];
    expect(attribute).toBe("data-react-aria-pressable");
    expect(template).toBeDefined();
    const injected = compact((template ?? "").replace(/\$\{[^}]+\}/, attribute ?? ""));
    expect(injected).toBe(
      "@layer { [data-react-aria-pressable] { touch-action: pan-x pan-y pinch-zoom; } }",
    );
    expect(compact(globalCss)).toContain(injected);
  });
});
