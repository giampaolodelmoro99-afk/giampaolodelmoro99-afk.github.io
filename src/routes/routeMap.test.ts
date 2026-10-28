import { describe, expect, it } from "vitest";
import {
  intlLocales,
  localeFromPathname,
  locales,
  notFoundPath,
  prerenderPaths,
  appIds,
  legacyPaths,
  routeKeyFromPathname,
  routeKeys,
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
    const paths = prerenderPaths();
    expect(paths).toHaveLength(routeKeys.length * locales.length + 1);
    expect(paths.slice(0, 2)).toEqual(["/", "/en"]);
    expect(paths).toContain("/profilo");
    expect(paths).toContain("/en/about");
    expect(paths.at(-1)).toBe(notFoundPath);
  });

  it("conserva gli URL della v1 per le app corrispondenti (SPECS.md §6)", () => {
    expect([
      routeMap.about.it,
      routeMap.skills.it,
      routeMap.projects.it,
      routeMap.contacts.it,
    ]).toEqual([...legacyPaths]);
  });

  it("ha percorsi diversi per ogni route e lingua, con l'inglese sotto /en/", () => {
    const all = routeKeys.flatMap((key) => locales.map((locale) => routeMap[key][locale]));
    expect(new Set(all).size).toBe(all.length);
    for (const key of routeKeys) {
      expect(routeMap[key].en.startsWith("/en/")).toBe(true);
      expect(routeMap[key].it.startsWith("/en/")).toBe(false);
      expect(routeMap[key].it.endsWith("/")).toBe(true);
    }
  });

  it("elenca le app senza il desktop", () => {
    expect(appIds).not.toContain("desktop");
    expect(appIds).toHaveLength(routeKeys.length - 1);
  });

  it("riconosce la route dal percorso, con o senza slash finale", () => {
    expect(routeKeyFromPathname(routeMap.desktop.it)).toBe("desktop");
    expect(routeKeyFromPathname("/en")).toBe("desktop");
    expect(routeKeyFromPathname("/en/sconosciuta")).toBeUndefined();
    expect(routeKeyFromPathname("/progetti")).toBe("projects");
    expect(routeKeyFromPathname("/en/projects/")).toBe("projects");
    expect(routeKeyFromPathname("/projects")).toBeUndefined();
  });

  it("fa fallire la build con un elenco vuoto o percorsi non validi", () => {
    expect(() => validatePaths([])).toThrow("nessuna route");
    expect(() => validatePaths(["/ok", "/Non Valida"])).toThrow("/Non Valida");
  });
});
