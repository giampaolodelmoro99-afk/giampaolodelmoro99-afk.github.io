import type { AppId } from "../../routes/routeMap";

export const desktopIconsId = "desktop-icons";

export function windowTitleId(app: AppId): string {
  return `window-${app}-title`;
}

export function windowBodyId(app: AppId): string {
  return `window-${app}-body`;
}
