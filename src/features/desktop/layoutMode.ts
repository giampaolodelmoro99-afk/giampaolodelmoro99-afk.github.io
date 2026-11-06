import type { LayoutMode } from "../../stores/desktop";

export const desktopLayoutQuery =
  "(width >= 768px) and (height >= 540px), (width >= 768px) and (pointer: fine)";

export const mobileLayoutQuery =
  "(width < 768px), (height < 540px) and (pointer: coarse), (height < 540px) and (pointer: none)";

const hasMatchMedia = () => typeof window.matchMedia === "function";

export function currentLayoutMode(): LayoutMode {
  if (!hasMatchMedia()) return "desktop";
  return window.matchMedia(desktopLayoutQuery).matches ? "desktop" : "mobile";
}

export const isDesktopLayout = () => currentLayoutMode() === "desktop";

export function subscribeLayoutMode(onChange: () => void): () => void {
  if (!hasMatchMedia()) return () => undefined;
  const query = window.matchMedia(desktopLayoutQuery);
  query.addEventListener("change", onChange);
  window.addEventListener("resize", onChange);
  return () => {
    query.removeEventListener("change", onChange);
    window.removeEventListener("resize", onChange);
  };
}
