import { type RouteConfig, route } from "@react-router/dev/routes";
import { locales, routeMap, routePath } from "../routes/routeMap";

export default locales.map((locale) =>
  route(routePath(routeMap.desktop[locale]), "routes/desktop.tsx", { id: `desktop-${locale}` }),
) satisfies RouteConfig;
