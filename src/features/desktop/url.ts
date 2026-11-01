import {
  type AppId,
  type Locale,
  type RouteKey,
  routeKeyFromPathname,
  routeMap,
  routePath,
} from "../../routes/routeMap";
import { openAppFor } from "../../stores/desktop";

export function pathFor(target: AppId | null, current: RouteKey, locale: Locale): string | null {
  if (target === null) return current === "desktop" ? null : routeMap.desktop[locale];
  if (openAppFor(current) === target) return null;
  return routeMap[target][locale];
}

export function backPathOf(state: unknown): string | null {
  if (typeof state !== "object" || state === null) return null;
  const back: unknown = Reflect.get(state, "back");
  return typeof back === "string" ? back : null;
}

export function samePath(a: string, b: string): boolean {
  return routePath(a) === routePath(b);
}

export function represents(path: string, target: AppId | null): boolean {
  const key = routeKeyFromPathname(path);
  if (key === undefined) return false;
  return target === null ? key === "desktop" : openAppFor(key) === target;
}
