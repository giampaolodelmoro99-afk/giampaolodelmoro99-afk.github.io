import { describe, expect, it } from "vitest";
import { bootId, bootScript, deferHydration } from "./hydration.mjs";

const bootstrap = '<script type="module" async="">import "/assets/a.js";</script>';

describe("deferHydration", () => {
  it("rende inerti i modulepreload e sposta il bootstrap in uno script inerte avviato al load", () => {
    const { html, payload } = deferHydration(
      `<head><link rel="modulepreload" href="/assets/a.js"/></head><body>${bootstrap}</body>`,
    );
    expect(payload).toBe('import "/assets/a.js";');
    expect(html).toContain('<link rel="modulepreload" href="/assets/a.js" media="not all"/>');
    expect(html).not.toMatch(/<link rel="modulepreload" href="[^"]+"\/>/);
    expect(html).not.toContain('<script type="module"');
    expect(html).toContain(`<script type="text/plain" id="${bootId}">${payload}</script>`);
    expect(html).toContain(`<script>${bootScript}</script>`);
  });

  it("fa fallire la build se il bootstrap manca o è duplicato", () => {
    expect(() => deferHydration("<body></body>")).toThrow("trovati 0");
    expect(() => deferHydration(bootstrap + bootstrap)).toThrow("trovati 2");
  });
});
