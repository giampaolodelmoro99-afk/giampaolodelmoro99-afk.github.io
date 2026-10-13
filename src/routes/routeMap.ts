export const locales = ["it", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "it";

export const routeMap = {
  desktop: { it: "/", en: "/en/" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routeMap;

export const notFoundPath = "/404";

function isRouteKey(key: string): key is RouteKey {
  return Object.hasOwn(routeMap, key);
}

export const routeKeys: RouteKey[] = Object.keys(routeMap).filter(isRouteKey);

export function routePath(href: string): string {
  return href === "/" ? href : href.replace(/\/+$/, "");
}

export function prerenderPaths(): string[] {
  const paths = [
    ...routeKeys.flatMap((key) => locales.map((locale) => routePath(routeMap[key][locale]))),
    notFoundPath,
  ];
  const invalid = paths.filter((path) => !/^\/([a-z0-9-]+(\/[a-z0-9-]+)*)?$/.test(path));
  if (paths.length === 0 || invalid.length > 0) {
    throw new Error(`routeMap non valida: ${invalid.join(", ") || "nessuna route"}`);
  }
  return paths;
}

export function localeFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : defaultLocale;
}

export function routeKeyFromPathname(pathname: string): RouteKey | undefined {
  const locale = localeFromPathname(pathname);
  const path = routePath(pathname);
  return routeKeys.find((key) => routePath(routeMap[key][locale]) === path);
}
