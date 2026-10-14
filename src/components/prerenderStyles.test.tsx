import { type ComponentType, type ReactElement, createElement, isValidElement } from "react";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

// Le story si cercano sul disco a ogni esecuzione: import.meta.glob verrebbe
// risolto una volta sola e la cache dei moduli di Vitest non vedrebbe i file nuovi.
const storyFiles = readdirSync(import.meta.dirname, { recursive: true, encoding: "utf8" })
  .filter((file) => file.endsWith(".stories.tsx"))
  .toSorted();
const modules: Record<string, unknown>[] = await Promise.all(
  storyFiles.map((file) => import(join(import.meta.dirname, file))),
);

const field = (value: unknown, key: string): unknown =>
  typeof value === "object" && value !== null ? Reflect.get(value, key) : undefined;

const isArgs = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isComponent = (value: unknown): value is ComponentType<Record<string, unknown>> =>
  typeof value === "function";

const asElement = (value: unknown): ReactElement | null => (isValidElement(value) ? value : null);

function story(id: string, meta: unknown, annotations: unknown) {
  const metaArgs = field(meta, "args");
  const storyArgs = field(annotations, "args");
  const args = { ...(isArgs(metaArgs) ? metaArgs : {}), ...(isArgs(storyArgs) ? storyArgs : {}) };
  const render = field(annotations, "render");
  const component = field(meta, "component");
  const Story = () => {
    if (typeof render === "function") return asElement(Reflect.apply(render, undefined, [args]));
    if (isComponent(component)) return createElement(component, args);
    return null;
  };
  const decorators = field(meta, "decorators");
  const Decorated = (Array.isArray(decorators) ? decorators : []).reduce<ComponentType>(
    (Inner, decorator: unknown) => () =>
      typeof decorator === "function"
        ? asElement(Reflect.apply(decorator, undefined, [Inner]))
        : createElement(Inner),
    Story,
  );
  return { id, element: createElement(Decorated) };
}

const stories = Object.values(modules).flatMap((module) => {
  const meta = module["default"];
  const title = String(field(meta, "title"));
  return Object.entries(module)
    .filter(([name]) => name !== "default")
    .map(([name, annotations]) => story(`${title}/${name}`, meta, annotations));
});

const styleAttributes = (html: string) =>
  [...html.matchAll(/\sstyle="([^"]*)"/g)].map((match) => match[1] ?? "");

// ADR-0012, tipo C: nell'HTML prerenderizzato del sito gli attributi style sono
// bloccati dalla CSP. Questo inventario elenca quelli che ogni story produce con
// il rendering lato server, così un componente non li introduce di nascosto.
// Ammessi oggi, da risolvere in F2A: le variabili CSS di Glyph e della
// ProgressBar e alcuni stili interni di React Aria: VisuallyHidden (input di
// Checkbox e Radio; HiddenSelect, nella variante con position:fixed) e
// display:contents (celle di GridList, Select).
const glyphVariables = /^--glyph-width:\d+;--glyph-height:\d+$/;
const hiddenRule =
  "border:0;clip:rect\\(0 0 0 0\\);clip-path:inset\\(50%\\);height:1px;margin:-1px;overflow:hidden;padding:0;position:";
const visuallyHidden = new RegExp(`^${hiddenRule}absolute;width:1px;white-space:nowrap$`);
const visuallyHiddenFixed = new RegExp(
  `^${hiddenRule}fixed;width:1px;white-space:nowrap;top:0;left:0$`,
);
const displayContents = /^display:contents$/;
const progressValue = /^--progress-value:\d+(\.\d+)?%$/;
const known = [
  { pattern: glyphVariables, example: "Componenti/Icon/Glifi" },
  { pattern: visuallyHidden, example: "Componenti/Checkbox/Stati" },
  { pattern: progressValue, example: "Componenti/ProgressBar/Stati" },
  { pattern: visuallyHiddenFixed, example: "Componenti/Select/Stati" },
  { pattern: displayContents, example: "Componenti/Select/Stati" },
];

describe("attributi style nel prerender (ADR-0012)", () => {
  it("trova le story di ogni componente", () => {
    const titles = new Set(stories.map(({ id }) => id.split("/").slice(0, 2).join("/")));
    expect(titles.size).toBe(storyFiles.length);
    expect(stories.map(({ id }) => id)).toContain("Componenti/Icon/Tutte");
  });

  it.each(stories)("$id produce solo attributi style noti", ({ element }) => {
    const unexpected = styleAttributes(renderToString(element)).filter(
      (style) => !known.some(({ pattern }) => pattern.test(style)),
    );
    expect(unexpected).toEqual([]);
  });

  it.each(known)("riconosce davvero gli attributi noti ($example)", ({ pattern, example }) => {
    const found = stories.find(({ id }) => id === example);
    const styles = styleAttributes(renderToString(found?.element ?? createElement("p")));
    expect(styles.some((style) => pattern.test(style))).toBe(true);
  });
});
