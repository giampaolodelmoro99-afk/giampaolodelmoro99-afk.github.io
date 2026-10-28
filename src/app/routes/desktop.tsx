import type { MetaArgs, MetaDescriptor } from "react-router";
import { Desktop } from "../../features/desktop/Desktop";
import { localeFromPathname, routeKeyFromPathname } from "../../routes/routeMap";
import { buildMeta } from "../../seo/buildMeta";

export function meta({ location }: Pick<MetaArgs, "location">): MetaDescriptor[] {
  return buildMeta(
    localeFromPathname(location.pathname),
    routeKeyFromPathname(location.pathname) ?? "desktop",
  );
}

export default function DesktopRoute() {
  return <Desktop />;
}
