import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  exportedNames,
  routeDiscoveryStub,
  routeDiscoveryExports,
  routeDiscoveryModule,
  stubRouteDiscovery,
  stubSource,
} from "./route-discovery-stub.mjs";

const production = resolve(
  import.meta.dirname,
  "../../node_modules/react-router/dist/production/lib/dom/ssr/route-discovery.js",
);
const original = readFileSync(production, "utf8");
const config = readFileSync(resolve(import.meta.dirname, "../../react-router.config.ts"), "utf8");

describe("stub della route discovery di React Router", () => {
  it("riconosce il modulo di produzione installato", () => {
    expect(routeDiscoveryModule.test(production)).toBe(true);
    expect(
      routeDiscoveryModule.test("/x/react-router/dist/development/lib/dom/ssr/route-discovery.js"),
    ).toBe(false);
  });

  it("il modulo installato esporta esattamente i nomi che lo stub sostituisce", () => {
    expect(exportedNames(original)).toEqual(routeDiscoveryExports.toSorted());
    expect(exportedNames(stubSource)).toEqual([]);
    expect(stubRouteDiscovery(original, production)).toBe(stubSource);
  });

  it("lascia stare gli altri moduli e ferma la build se gli export cambiano", () => {
    expect(stubRouteDiscovery(original, "/x/react-router/dist/production/index.js")).toBeNull();
    expect(() =>
      stubRouteDiscovery("export { RouteDiscoveryRuntime, somethingNew };", production),
    ).toThrow(/rivedi scripts\/lib\/route-discovery-stub\.mjs/);
  });

  it("lo stub esporta gli stessi nomi e fallisce in modo esplicito se usato", async () => {
    const stub = await import(`data:text/javascript,${encodeURIComponent(stubSource)}`);
    expect(Object.keys(stub).toSorted()).toEqual(routeDiscoveryExports.toSorted());
    expect(() => new stub.RouteDiscoveryRuntime()).toThrow(/unstable_customRouteDiscovery/);
    expect(() => stub.useRouteDiscovery()).toThrow(/unstable_customRouteDiscovery/);
  });

  it("il sito non attiva la custom route discovery", () => {
    expect(config).not.toMatch(/unstable_customRouteDiscovery/);
  });

  it("la build che usa HydratedRouter si ferma se il modulo non passa mai dallo stub", () => {
    const hydrated = "/x/react-router/dist/production/lib/dom-export/hydrated-router.js";
    const missing = routeDiscoveryStub();
    expect(missing.transform("export const x = 1;", hydrated)).toBeNull();
    expect(() => missing.buildEnd(undefined)).toThrow(/non è passato dallo stub/);
    expect(() => missing.buildEnd(new Error("altro"))).not.toThrow();
    const ok = routeDiscoveryStub();
    ok.transform("export const x = 1;", hydrated);
    expect(ok.transform(original, production)).toBe(stubSource);
    expect(() => ok.buildEnd(undefined)).not.toThrow();
  });

  it("una build senza HydratedRouter (Storybook) non richiede lo stub", () => {
    const storybook = routeDiscoveryStub();
    storybook.transform("export const x = 1;", "/x/react-router/dist/production/index.js");
    expect(() => storybook.buildEnd(undefined)).not.toThrow();
  });
});
