import { type ComponentType, type ReactElement, createElement, isValidElement } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

const modules = import.meta.glob<Record<string, unknown>>("./**/*.stories.tsx", { eager: true });

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
// Gli unici ammessi oggi sono le variabili CSS di Glyph, da risolvere in F2A
// insieme agli altri attributi del tipo C.
const glyphVariables = /^--glyph-width:\d+;--glyph-height:\d+$/;

describe("attributi style nel prerender (ADR-0012)", () => {
  it("trova le story dei componenti", () => {
    expect(stories.map(({ id }) => id)).toContain("Componenti/Icon/Tutte");
  });

  it.each(stories)("$id produce solo le variabili di Glyph", ({ element }) => {
    const unexpected = styleAttributes(renderToString(element)).filter(
      (style) => !glyphVariables.test(style),
    );
    expect(unexpected).toEqual([]);
  });

  it("riconosce davvero le variabili di Glyph (story Glifi)", () => {
    const glyphs = stories.find(({ id }) => id === "Componenti/Icon/Glifi");
    const styles = styleAttributes(renderToString(glyphs?.element ?? createElement("p")));
    expect(styles.length).toBeGreaterThan(0);
    expect(styles.every((style) => glyphVariables.test(style))).toBe(true);
  });
});
