import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Viewport } from "../../../stores/desktop";
import { useWorkspaceViewport } from "./useWorkspaceViewport";

let observed: (() => void) | null = null;

class FakeResizeObserver {
  constructor(callback: () => void) {
    observed = callback;
  }
  observe() {}
  disconnect() {
    observed = null;
  }
}

function sized(element: HTMLElement, width: number, height: number) {
  Object.defineProperty(element, "clientWidth", { configurable: true, value: width });
  Object.defineProperty(element, "clientHeight", { configurable: true, value: height });
}

function setup() {
  const workspace = document.createElement("main");
  const metrics = document.createElement("div");
  metrics.innerHTML = `<span data-metric="window"></span><span data-metric="titlebar"></span>`;
  sized(workspace, 1000, 700);
  document.body.append(workspace, metrics);
  const onChange = vi.fn<(viewport: Viewport) => void>();
  const hook = renderHook(() => useWorkspaceViewport(onChange));
  act(() => {
    hook.result.current.workspaceRef(workspace);
    hook.result.current.metricsRef(metrics);
  });
  return { workspace, onChange, hook };
}

describe("useWorkspaceViewport", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame"] });
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    document.body.replaceChildren();
  });

  it("misura subito l'area all'avvio", () => {
    const { onChange } = setup();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ width: 1000, height: 700 }),
    );
  });

  it("non aggiorna lo store dentro la callback del ResizeObserver, ma al frame dopo e una volta sola", () => {
    const { workspace, onChange } = setup();
    sized(workspace, 800, 600);
    observed?.();
    observed?.();
    expect(onChange).toHaveBeenCalledTimes(1);
    act(() => {
      vi.advanceTimersToNextFrame();
    });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ width: 800, height: 600 }));
  });

  it("ignora le notifiche che non cambiano le misure", () => {
    const { onChange } = setup();
    observed?.();
    act(() => {
      vi.advanceTimersToNextFrame();
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("ignora un'area senza dimensioni e annulla il frame in sospeso allo smontaggio", () => {
    const { workspace, onChange, hook } = setup();
    sized(workspace, 0, 0);
    observed?.();
    act(() => {
      vi.advanceTimersToNextFrame();
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    sized(workspace, 900, 500);
    observed?.();
    hook.unmount();
    act(() => {
      vi.advanceTimersToNextFrame();
    });
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
