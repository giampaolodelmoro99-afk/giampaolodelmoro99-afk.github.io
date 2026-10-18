import { describe, expect, it } from "vitest";
import {
  intlLocales,
  localeFromPathname,
  locales,
  notFoundPath,
  prerenderPaths,
  routeKeyFromPathname,
  routeMap,
  routePath,
  validatePaths,
} from "./routeMap";

describe("routeMap", () => {
  it("ricava la lingua dal percorso", () => {
    expect(localeFromPathname("/")).toBe("it");
    expect(localeFromPathname("/en")).toBe("en");
    expect(localeFromPathname("/en/")).toBe("en");
    expect(localeFromPathname("/english")).toBe("it");
  });

  it("associa a ogni lingua il tag BCP 47 usato da React Aria", () => {
    expect(Object.keys(intlLocales)).toEqual([...locales]);
    for (const locale of locales) {
      expect(intlLocales[locale]).toMatch(new RegExp(`^${locale}-[A-Z]{2}$`));
    }
  });

  it("toglie la slash finale tranne che dalla radice", () => {
    expect(routePath("/")).toBe("/");
    expect(routePath("/en/")).toBe("/en");
  });

  it("elenca tutte le route da prerenderizzare, 404 compresa", () => {
    expect(prerenderPaths()).toEqual(["/", "/en", notFoundPath]);
  });

  it("riconosce la route dal percorso, con o senza slash finale", () => {
    expect(routeKeyFromPathname(routeMap.desktop.it)).toBe("desktop");
    expect(routeKeyFromPathname("/en")).toBe("desktop");
    expect(routeKeyFromPathname("/en/sconosciuta")).toBeUndefined();
  });

  it("fa fallire la build con un elenco vuoto o percorsi non validi", () => {
    expect(() => validatePaths([])).toThrow("nessuna route");
    expect(() => validatePaths(["/ok", "/Non Valida"])).toThrow("/Non Valida");
  });
});
