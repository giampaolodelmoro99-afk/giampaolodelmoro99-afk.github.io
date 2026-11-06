import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  currentLayoutMode,
  desktopLayoutQuery,
  isDesktopLayout,
  mobileLayoutQuery,
  subscribeLayoutMode,
} from "./layoutMode";

const css = readFileSync(resolve(import.meta.dirname, "Desktop.module.css"), "utf8").replaceAll(
  /\s+/g,
  " ",
);

function stubMatchMedia(matches: boolean) {
  const listeners = new Set<() => void>();
  const list = {
    matches,
    addEventListener: vi.fn<(type: string, listener: () => void) => void>((_type, listener) => {
      listeners.add(listener);
    }),
    removeEventListener: vi.fn<(type: string, listener: () => void) => void>((_type, listener) => {
      listeners.delete(listener);
    }),
  };
  vi.stubGlobal(
    "matchMedia",
    vi.fn<() => typeof list>(() => list),
  );
  return { list, listeners };
}

describe("modalità di layout", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("le due media query di JS sono le stesse scritte nel CSS", () => {
    expect(css).toContain(`@media ${desktopLayoutQuery} {`);
    expect(css).toContain(`@media ${mobileLayoutQuery} {`);
  });

  it("la modalità segue la media query; senza matchMedia è desktop", () => {
    stubMatchMedia(true);
    expect(currentLayoutMode()).toBe("desktop");
    expect(isDesktopLayout()).toBe(true);
    stubMatchMedia(false);
    expect(currentLayoutMode()).toBe("mobile");
    expect(isDesktopLayout()).toBe(false);
    vi.stubGlobal("matchMedia", undefined);
    expect(currentLayoutMode()).toBe("desktop");
    expect(subscribeLayoutMode(() => undefined)()).toBeUndefined();
  });

  it("si aggiorna anche su resize, perché l'evento change può perdersi con ridimensionamenti ravvicinati", () => {
    const { list } = stubMatchMedia(false);
    const onChange = vi.fn<() => void>();
    const unsubscribe = subscribeLayoutMode(onChange);
    expect(list.addEventListener).toHaveBeenCalledWith("change", onChange);
    window.dispatchEvent(new Event("resize"));
    expect(onChange).toHaveBeenCalledTimes(1);
    unsubscribe();
    expect(list.removeEventListener).toHaveBeenCalledWith("change", onChange);
    window.dispatchEvent(new Event("resize"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
