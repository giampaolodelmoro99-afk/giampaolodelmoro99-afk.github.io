import type { MetaArgs, MetaDescriptor } from "react-router";
import { Desktop } from "../../features/desktop/Desktop";
import { localeFromPathname } from "../../routes/routeMap";
import { buildMeta } from "../../seo/buildMeta";

export function meta({ location }: Pick<MetaArgs, "location">): MetaDescriptor[] {
  return buildMeta(localeFromPathname(location.pathname), "desktop");
}

export default function DesktopRoute() {
  return <Desktop />;
}
