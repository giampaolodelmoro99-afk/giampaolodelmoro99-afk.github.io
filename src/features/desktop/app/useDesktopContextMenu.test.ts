import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDesktopContextMenu } from "./useDesktopContextMenu";

// jsdom non ha PointerEvent: gli eventi del puntatore sono MouseEvent con
// pointerType aggiunto.
function pointer(type: string, init: { x: number; y: number; pointerType?: string }) {
  const event = new MouseEvent(type, { bubbles: true, clientX: init.x, clientY: init.y });
  Object.defineProperty(event, "pointerType", { value: init.pointerType ?? "touch" });
  return event;
}

function setup(enabled = true) {
  const workspace = document.createElement("main");
  workspace.innerHTML = `
    <div role="grid"><div role="row" data-key="cv" tabindex="0"><span>CV</span></div></div>
    <div role="row" data-key="unknown" tabindex="0">Altro</div>
    <section><p>Finestra</p></section>
    <div class="empty">sfondo</div>`;
  document.body.append(workspace);
  const isEnabled = () => enabled;
  const hook = renderHook(() => useDesktopContextMenu(workspace, isEnabled));
  const element = (selector: string) => {
    const found = workspace.querySelector<HTMLElement>(selector);
    if (!found) throw new Error(selector);
    return found;
  };
  return { hook, element, workspace };
}

describe("useDesktopContextMenu", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    document.body.replaceChildren();
  });

  it("il tasto destro sullo sfondo apre il menu nel punto, senza icona", () => {
    const { hook, element } = setup();
    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      clientX: 300,
      clientY: 200,
    });
    act(() => {
      element(".empty").dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
    expect(hook.result.current[0]).toEqual({ x: 300, y: 200, iconId: null });
  });

  it("il tasto destro su un'icona riconosce l'app; un data-key sconosciuto no", () => {
    const { hook, element } = setup();
    act(() => {
      element("[data-key=cv] span").dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, clientX: 10, clientY: 20 }),
      );
    });
    expect(hook.result.current[0]?.iconId).toBe("cv");
    act(() => {
      element("[data-key=unknown]").dispatchEvent(
        new MouseEvent("contextmenu", { bubbles: true, clientX: 10, clientY: 20 }),
      );
    });
    expect(hook.result.current[0]?.iconId).toBeNull();
  });

  it("l'evento contextmenu da tastiera (0, 0) usa il rettangolo dell'elemento", () => {
    const { hook, element } = setup();
    vi.spyOn(element(".empty"), "getBoundingClientRect").mockReturnValue(
      DOMRect.fromRect({ x: 40, y: 50, width: 100, height: 30 }),
    );
    act(() => {
      element(".empty").dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }));
    });
    expect(hook.result.current[0]).toEqual({ x: 40, y: 80, iconId: null });
  });

  it("dentro una finestra il tasto destro lascia il menu del browser", () => {
    const { hook, element } = setup();
    const event = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
    act(() => {
      element("section p").dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(false);
    expect(hook.result.current[0]).toBeNull();
  });

  it("non apre nulla quando il desktop largo non è attivo", () => {
    const { hook, element } = setup(false);
    act(() => {
      element(".empty").dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }));
      element(".empty").dispatchEvent(
        new KeyboardEvent("keydown", { key: "ContextMenu", bubbles: true }),
      );
      element(".empty").dispatchEvent(pointer("pointerdown", { x: 5, y: 5 }));
      vi.advanceTimersByTime(600);
    });
    expect(hook.result.current[0]).toBeNull();
  });

  it.each([
    ["Maiusc+F10", { key: "F10", shiftKey: true }],
    ["tasto Menu", { key: "ContextMenu" }],
  ])("%s apre il menu accanto all'elemento con il focus", (_name, init) => {
    const { hook, element } = setup();
    vi.spyOn(element("[data-key=cv]"), "getBoundingClientRect").mockReturnValue(
      DOMRect.fromRect({ x: 12, y: 30, width: 80, height: 70 }),
    );
    const event = new KeyboardEvent("keydown", { ...init, bubbles: true, cancelable: true });
    act(() => {
      element("[data-key=cv]").dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
    expect(hook.result.current[0]).toEqual({ x: 12, y: 100, iconId: "cv" });
  });

  it("altri tasti, F10 senza Maiusc e i tasti dentro una finestra non aprono il menu", () => {
    const { hook, element } = setup();
    act(() => {
      element(".empty").dispatchEvent(new KeyboardEvent("keydown", { key: "F10", bubbles: true }));
      element(".empty").dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true }));
      element("section p").dispatchEvent(
        new KeyboardEvent("keydown", { key: "ContextMenu", bubbles: true }),
      );
    });
    expect(hook.result.current[0]).toBeNull();
  });

  it("la pressione lunga di 500 ms al tocco apre il menu nel punto del tocco", () => {
    const { hook, element } = setup();
    act(() => {
      element("[data-key=cv]").dispatchEvent(pointer("pointerdown", { x: 30, y: 40 }));
      element("[data-key=cv]").dispatchEvent(pointer("pointermove", { x: 34, y: 43 }));
      vi.advanceTimersByTime(499);
    });
    expect(hook.result.current[0]).toBeNull();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(hook.result.current[0]).toEqual({ x: 30, y: 40, iconId: "cv" });
  });

  it.each([
    ["spostamento oltre 10 px", "pointermove"],
    ["dito sollevato", "pointerup"],
    ["tocco annullato", "pointercancel"],
  ])("la pressione lunga si annulla con %s", (_name, type) => {
    const { hook, element } = setup();
    act(() => {
      element(".empty").dispatchEvent(pointer("pointerdown", { x: 30, y: 40 }));
      element(".empty").dispatchEvent(pointer(type, { x: 60, y: 40 }));
      vi.advanceTimersByTime(600);
    });
    expect(hook.result.current[0]).toBeNull();
  });

  it("il mouse e i tocchi dentro una finestra non avviano la pressione lunga", () => {
    const { hook, element } = setup();
    act(() => {
      element(".empty").dispatchEvent(pointer("pointerdown", { x: 1, y: 1, pointerType: "mouse" }));
      element("section p").dispatchEvent(pointer("pointerdown", { x: 1, y: 1 }));
      vi.advanceTimersByTime(600);
    });
    expect(hook.result.current[0]).toBeNull();
  });

  it("smontato, toglie gli ascoltatori e il timer", () => {
    const { hook, element } = setup();
    act(() => {
      element(".empty").dispatchEvent(pointer("pointerdown", { x: 1, y: 1 }));
    });
    hook.unmount();
    act(() => {
      vi.advanceTimersByTime(600);
      element(".empty").dispatchEvent(new MouseEvent("contextmenu", { bubbles: true }));
    });
    expect(hook.result.current[0]).toBeNull();
  });

  it("senza area di lavoro non fa nulla", () => {
    const { result } = renderHook(() => useDesktopContextMenu(null, () => true));
    expect(result.current[0]).toBeNull();
  });
});
