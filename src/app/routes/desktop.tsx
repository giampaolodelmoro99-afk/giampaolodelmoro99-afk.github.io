import { Desktop } from "../../features/desktop/Desktop";
import { localeFromPathname } from "../../routes/routeMap";
import { buildMeta } from "../../seo/buildMeta";
import type { Route } from "./+types/desktop";

export const meta: Route.MetaFunction = ({ location }) =>
  buildMeta(localeFromPathname(location.pathname), "desktop");

export default function DesktopRoute() {
  return <Desktop />;
}
