export const locales = ["it", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "it";

export const intlLocales = { it: "it-IT", en: "en-US" } as const satisfies Record<Locale, string>;

export const routeMap = {
  desktop: { it: "/", en: "/en/" },
  about: { it: "/profilo/", en: "/en/about/" },
  projects: { it: "/progetti/", en: "/en/projects/" },
  cv: { it: "/cv/", en: "/en/cv/" },
  contacts: { it: "/contatti/", en: "/en/contact/" },
  simpleView: { it: "/vista-semplice/", en: "/en/simple-view/" },
  skills: { it: "/stack/", en: "/en/skills/" },
  timeline: { it: "/timeline/", en: "/en/timeline/" },
  makingOf: { it: "/making-of/", en: "/en/making-of/" },
  terminal: { it: "/terminale/", en: "/en/terminal/" },
  minefield: { it: "/campo-minato/", en: "/en/minefield/" },
  controlPanel: { it: "/pannello-di-controllo/", en: "/en/control-panel/" },
  privacy: { it: "/privacy/", en: "/en/privacy/" },
  trash: { it: "/cestino/", en: "/en/trash/" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routeMap;

export type AppId = Exclude<RouteKey, "desktop">;

export const legacyPaths = ["/profilo/", "/stack/", "/progetti/", "/contatti/"] as const;

export const notFoundPath = "/404";

function isRouteKey(key: string): key is RouteKey {
  return Object.hasOwn(routeMap, key);
}

export const routeKeys: RouteKey[] = Object.keys(routeMap).filter(isRouteKey);

export const appIds: AppId[] = routeKeys.filter((key): key is AppId => key !== "desktop");

export function routePath(href: string): string {
  return href === "/" ? href : href.replace(/\/+$/, "");
}

export function validatePaths(paths: string[]): string[] {
  const invalid = paths.filter((path) => !/^\/([a-z0-9-]+(\/[a-z0-9-]+)*)?$/.test(path));
  if (paths.length === 0 || invalid.length > 0) {
    throw new Error(`routeMap non valida: ${invalid.join(", ") || "nessuna route"}`);
  }
  return paths;
}

export function prerenderPaths(): string[] {
  return validatePaths([
    ...routeKeys.flatMap((key) => locales.map((locale) => routePath(routeMap[key][locale]))),
    notFoundPath,
  ]);
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : defaultLocale;
}

export function routeKeyFromPathname(pathname: string): RouteKey | undefined {
  const locale = localeFromPathname(pathname);
  const path = routePath(pathname);
  return routeKeys.find((key) => routePath(routeMap[key][locale]) === path);
}
