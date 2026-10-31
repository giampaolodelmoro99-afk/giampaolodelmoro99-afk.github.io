import type { AppId } from "../../routes/routeMap";

export const desktopIconsId = "desktop-icons";

export function windowTitleId(app: AppId): string {
  return `window-${app}-title`;
}

export function taskbarButtonId(app: AppId): string {
  return `taskbar-${app}`;
}

export function windowBodyId(app: AppId): string {
  return `window-${app}-body`;
}

export type FocusKey = "skip" | "language" | `icon-${AppId}` | `body-${AppId}`;

export function focusKeyOf(element: Element | null): FocusKey | null {
  const key = element?.closest("[data-focus-key]")?.getAttribute("data-focus-key");
  return isFocusKey(key) ? key : null;
}

const focusKeyPattern = /^(skip|language|(icon|body)-[a-zA-Z]+)$/;

function isFocusKey(value: string | null | undefined): value is FocusKey {
  return typeof value === "string" && focusKeyPattern.test(value);
}

export function focusTarget(key: FocusKey): HTMLElement | null {
  if (key.startsWith("icon-")) {
    return document.querySelector<HTMLElement>(
      `#${desktopIconsId} [role="row"][data-key="${key.slice(5)}"]`,
    );
  }
  if (key.startsWith("body-")) {
    return document.getElementById(`window-${key.slice(5)}-body`);
  }
  return document.querySelector<HTMLElement>(`[data-focus-key="${key}"]`);
}
