import { type RouteConfig, route } from "@react-router/dev/routes";
import { locales, routeKeys, routeMap, routePath } from "../routes/routeMap";

export default [
  ...routeKeys.flatMap((key) =>
    locales.map((locale) =>
      route(routePath(routeMap[key][locale]), "routes/desktop.tsx", { id: `${key}-${locale}` }),
    ),
  ),
  route("*", "routes/not-found.tsx", { id: "not-found" }),
] satisfies RouteConfig;
