import type { AppId, RouteKey } from "../../routes/routeMap";

export const homeApp: AppId = "about";

export function openAppFor(routeKey: RouteKey): AppId {
  return routeKey === "desktop" ? homeApp : routeKey;
}
