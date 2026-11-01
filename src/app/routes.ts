import { type RouteConfig, layout, route } from "@react-router/dev/routes";
import { locales, routeKeys, routeMap, routePath } from "../routes/routeMap";

export default [
  layout(
    "routes/desktop-layout.tsx",
    { id: "desktop" },
    routeKeys.flatMap((key) =>
      locales.map((locale) =>
        route(routePath(routeMap[key][locale]), "routes/app.tsx", { id: `${key}-${locale}` }),
      ),
    ),
  ),
  route("*", "routes/not-found.tsx", { id: "not-found" }),
] satisfies RouteConfig;
