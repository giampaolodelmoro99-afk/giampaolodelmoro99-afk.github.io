import { useLocation } from "react-router";
import { routeKeyFromPathname } from "../../routes/routeMap";
import { DesktopShell } from "./shell/DesktopShell";

export function Desktop() {
  const routeKey = routeKeyFromPathname(useLocation().pathname) ?? "desktop";
  return <DesktopShell routeKey={routeKey} />;
}
