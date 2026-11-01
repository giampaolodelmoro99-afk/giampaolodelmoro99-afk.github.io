import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { AppId } from "../../../routes/routeMap";
import type { Edge, Geometry, Viewport } from "../../../stores/desktop";
import { useWindowGestures, windowRect } from "./useWindowGestures";

// jsdom non ha PointerEvent né la cattura del puntatore: gli eventi sono
// MouseEvent con pointerId, e la cattura è simulata sull'elemento.
function pointer(
  type: string,
  x: number,
  y: number,
  init: { pointerId?: number; button?: number } = {},
) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
    button: init.button ?? 0,
  });
  Object.defineProperty(event, "pointerId", { value: init.pointerId ?? 1 });
  return event;
}

function rect(element: Element, box: Geometry) {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue(
    DOMRect.fromRect({ x: box.x, y: box.y, width: box.width, height: box.height }),
  );
}

const viewport: Viewport = {
  width: 1000,
  height: 700,
  minWidth: 240,
  minHeight: 160,
  keepVisible: 48,
  titlebarHeight: 20,
};

function setup(options: { enabled?: boolean; limits?: Viewport | null } = {}) {
  const workspace = document.createElement("main");
  const frame = document.createElement("section");
  const handle = document.createElement("div");
  frame.append(handle);
  workspace.append(frame);
  document.body.append(workspace);
  rect(workspace, { x: 0, y: 30, width: 1000, height: 700 });
  rect(frame, { x: 100, y: 130, width: 400, height: 300 });
  const captured = new Set<number>();
  Object.assign(handle, {
    setPointerCapture: (id: number) => captured.add(id),
    releasePointerCapture: (id: number) => captured.delete(id),
    hasPointerCapture: (id: number) => captured.has(id),
  });
  const onPlace = vi.fn<(id: AppId, geometry: Geometry) => void>();
  const hook = renderHook(() =>
    useWindowGestures({
      workspace,
      viewport: () => (options.limits === undefined ? viewport : options.limits),
      isEnabled: () => options.enabled ?? true,
      onPlace,
    }),
  );
  const start = (edge: Edge | null, x: number, y: number, init?: { button?: number }) => {
    const event = pointer("pointerdown", x, y, init);
    handle.addEventListener(
      "pointerdown",
      (down) => hook.result.current.start("about", edge, down, frame),
      { once: true },
    );
    act(() => {
      handle.dispatchEvent(event);
    });
    return event;
  };
  const send = (type: string, x: number, y: number, pointerId = 1) => {
    act(() => {
      handle.dispatchEvent(pointer(type, x, y, { pointerId }));
    });
  };
  return { hook, handle, onPlace, start, send, captured };
}

describe("windowRect", () => {
  it("misura la finestra rispetto all'area di lavoro", () => {
    const workspace = document.createElement("main");
    const frame = document.createElement("section");
    rect(workspace, { x: 10, y: 20, width: 800, height: 600 });
    rect(frame, { x: 110, y: 70, width: 300, height: 200 });
    expect(windowRect(frame, workspace)).toEqual({ x: 100, y: 50, width: 300, height: 200 });
  });
});

describe("useWindowGestures", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.replaceChildren();
  });

  it("il trascinamento sposta il contorno e al rilascio posiziona la finestra una volta", async () => {
    const { hook, onPlace, start, send, captured } = setup();
    const down = start(null, 200, 140);
    expect(down.defaultPrevented).toBe(true);
    expect(captured.has(1)).toBe(true);
    send("pointermove", 260, 180);
    await act(() => new Promise(requestAnimationFrame));
    expect(hook.result.current.outline).toEqual({ x: 160, y: 140, width: 400, height: 300 });
    send("pointerup", 260, 180);
    expect(onPlace).toHaveBeenCalledExactlyOnceWith("about", {
      x: 160,
      y: 140,
      width: 400,
      height: 300,
    });
    expect(hook.result.current.outline).toBeNull();
    expect(captured.size).toBe(0);
  });

  it("sotto la soglia di 4 px è un clic: niente contorno né posizione", () => {
    const { onPlace, start, send } = setup();
    start(null, 200, 140);
    send("pointermove", 202, 141);
    send("pointerup", 202, 141);
    expect(onPlace).not.toHaveBeenCalled();
  });

  it("il ridimensionamento da un bordo rispetta la misura minima e segnala la finestra", () => {
    const { hook, onPlace, start, send } = setup();
    start("se", 500, 430);
    expect(hook.result.current.resizing).toBe("about");
    send("pointermove", 100, 100);
    send("pointerup", 100, 100);
    expect(onPlace).toHaveBeenCalledWith("about", { x: 100, y: 100, width: 240, height: 160 });
    expect(hook.result.current.resizing).toBeNull();
  });

  it("senza misure dell'area il gesto non applica limiti", () => {
    const { onPlace, start, send } = setup({ limits: null });
    start("e", 500, 200);
    send("pointermove", 300, 200);
    send("pointerup", 300, 200);
    expect(onPlace).toHaveBeenCalledWith("about", { x: 100, y: 100, width: 200, height: 300 });
  });

  it("i limiti tengono la barra del titolo nell'area visibile", () => {
    const { onPlace, start, send } = setup();
    start(null, 200, 140);
    send("pointermove", 200, -500);
    send("pointerup", 200, -500);
    expect(onPlace.mock.calls[0]?.[1].y).toBe(0);
  });

  it.each([
    [
      "Esc",
      (_handle: HTMLElement) =>
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })),
      true,
    ],
    [
      "pointercancel",
      (handle: HTMLElement) => handle.dispatchEvent(pointer("pointercancel", 0, 0)),
      false,
    ],
  ])("%s annulla il gesto senza posizionare", (_name, cancel) => {
    const { hook, handle, onPlace, start, send } = setup();
    start(null, 200, 140);
    send("pointermove", 300, 300);
    act(() => {
      cancel(handle);
    });
    send("pointerup", 300, 300);
    expect(onPlace).not.toHaveBeenCalled();
    expect(hook.result.current.outline).toBeNull();
  });

  it("altri tasti e un altro puntatore non toccano il gesto", () => {
    const { onPlace, start, send } = setup();
    start(null, 200, 140);
    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    });
    send("pointermove", 400, 400, 2);
    send("pointermove", 260, 180);
    send("pointerup", 260, 180);
    expect(onPlace).toHaveBeenCalledWith("about", { x: 160, y: 140, width: 400, height: 300 });
  });

  it("non parte con il tasto destro, a desktop stretto o con un gesto già in corso", () => {
    const disabled = setup({ enabled: false });
    expect(disabled.start(null, 200, 140).defaultPrevented).toBe(false);
    document.body.replaceChildren();
    const { start, captured } = setup();
    expect(start(null, 200, 140, { button: 2 }).defaultPrevented).toBe(false);
    start(null, 200, 140);
    expect(start(null, 210, 150).defaultPrevented).toBe(false);
    expect(captured.size).toBe(1);
  });
});
