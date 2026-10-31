import { describe, expect, it } from "vitest";
import type { Viewport } from "./geometry";
import {
  type DesktopState,
  close,
  deserialize,
  emptyState,
  focus,
  initialStateFor,
  minimize,
  open,
  openAppFor,
  place,
  serialize,
  setViewport,
  toggleMaximize,
  zIndexOf,
} from "./state";

const viewport: Viewport = {
  width: 1000,
  height: 700,
  minWidth: 240,
  minHeight: 120,
  keepVisible: 48,
  titlebarHeight: 28,
};

const three = (): DesktopState => open(open(open(emptyState, "about"), "projects"), "terminal");

describe("stato del desktop", () => {
  it("parte dall'URL: About sulla home, l'app della route altrove", () => {
    expect(openAppFor("desktop")).toBe("about");
    expect(initialStateFor("desktop")).toMatchObject({
      stack: ["about"],
      recent: ["about"],
      activeId: "about",
      windows: { about: { maximized: false, minimized: false, geometry: null, cascade: 0 } },
    });
    expect(initialStateFor("projects").activeId).toBe("projects");
  });

  it("apre una finestra in cima, attiva, con lo scalino successivo", () => {
    const state = three();
    expect(state.stack).toEqual(["about", "projects", "terminal"]);
    expect(state.recent).toEqual(["terminal", "projects", "about"]);
    expect(state.activeId).toBe("terminal");
    expect(state.windows.terminal?.cascade).toBe(2);
    expect(zIndexOf(state, "terminal")).toBeGreaterThan(zIndexOf(state, "about"));
  });

  it("riaprire una finestra aperta la porta in primo piano senza duplicarla", () => {
    const state = open(three(), "about");
    expect(state.stack).toEqual(["projects", "terminal", "about"]);
    expect(Object.keys(state.windows)).toHaveLength(3);
    expect(state.activeId).toBe("about");
  });

  it("il focus porta in cima e in testa all'ordine d'uso", () => {
    const state = focus(three(), "projects");
    expect(state.stack.at(-1)).toBe("projects");
    expect(state.recent[0]).toBe("projects");
    expect(state.activeId).toBe("projects");
  });

  it("il focus su una finestra ridotta la ripristina", () => {
    const base = three();
    const minimized: DesktopState = {
      ...base,
      windows: { ...base.windows, about: { ...base.windows.about!, minimized: true } },
    };
    expect(focus(minimized, "about").windows.about?.minimized).toBe(false);
  });

  it("ignora focus e chiusura di finestre non aperte", () => {
    const state = three();
    expect(focus(state, "cv")).toBe(state);
    expect(close(state, "cv")).toBe(state);
  });

  it("chiudendo la finestra attiva attiva la successiva per ordine d'uso", () => {
    const state = close(focus(three(), "about"), "about");
    expect(state.windows.about).toBeUndefined();
    expect(state.stack).toEqual(["projects", "terminal"]);
    expect(state.activeId).toBe("terminal");
  });

  it("chiudendo l'ultima finestra non resta nessuna finestra attiva", () => {
    expect(close(initialStateFor("desktop"), "about")).toMatchObject({
      windows: {},
      stack: [],
      activeId: null,
    });
  });

  it("chiudendo salta le finestre ridotte a icona nella scelta della successiva", () => {
    const base = three();
    const state: DesktopState = {
      ...base,
      windows: { ...base.windows, projects: { ...base.windows.projects!, minimized: true } },
    };
    expect(close(state, "terminal").activeId).toBe("about");
  });
});

describe("ridurre, ingrandire e posizionare", () => {
  it("ridurre a icona lascia la finestra nell'ordine e attiva la successiva", () => {
    const state = minimize(three(), "terminal");
    expect(state.windows.terminal?.minimized).toBe(true);
    expect(state.stack).toContain("terminal");
    expect(state.activeId).toBe("projects");
    expect(minimize(state, "cv")).toBe(state);
  });

  it("riducendo l'ultima finestra visibile non resta nessuna finestra attiva", () => {
    expect(minimize(initialStateFor("desktop"), "about").activeId).toBeNull();
  });

  it("una finestra ingrandita e poi ridotta torna ingrandita", () => {
    const maximized = toggleMaximize(three(), "about");
    expect(maximized.windows.about?.maximized).toBe(true);
    expect(maximized.activeId).toBe("about");
    const restored = focus(minimize(maximized, "about"), "about");
    expect(restored.windows.about).toMatchObject({ maximized: true, minimized: false });
    expect(toggleMaximize(restored, "about").windows.about?.maximized).toBe(false);
    expect(toggleMaximize(restored, "cv")).toBe(restored);
  });

  it("posizionare una finestra la tiene dentro l'area visibile e toglie l'ingrandimento", () => {
    const state = setViewport(toggleMaximize(three(), "about"), viewport);
    const placed = place(state, "about", { x: -2000, y: -50, width: 5000, height: 10 });
    expect(placed.windows.about).toMatchObject({
      maximized: false,
      geometry: { x: 48 - 1000, y: 0, width: 1000, height: 120 },
    });
    const right = place(state, "about", { x: 2000, y: 2000, width: 300, height: 200 });
    expect(right.windows.about?.geometry).toEqual({ x: 952, y: 672, width: 300, height: 200 });
    expect(place(state, "cv", { x: 0, y: 0, width: 300, height: 200 })).toBe(state);
  });

  it("senza area nota la geometria si accetta così com'è", () => {
    const geometry = { x: -10, y: -10, width: 10, height: 10 };
    expect(place(three(), "about", geometry).windows.about?.geometry).toEqual(geometry);
  });

  it("quando l'area cambia, le finestre posizionate rientrano", () => {
    const placed = place(setViewport(three(), viewport), "projects", {
      x: 900,
      y: 600,
      width: 300,
      height: 200,
    });
    const smaller = setViewport(placed, { ...viewport, width: 500, height: 400 });
    expect(smaller.windows.projects?.geometry).toEqual({ x: 452, y: 372, width: 300, height: 200 });
    expect(smaller.windows.about?.geometry).toBeNull();
    expect(smaller.viewport?.width).toBe(500);
  });
});

describe("serializzazione (persistenza della 2B)", () => {
  it("va e torna senza perdere nulla", () => {
    const state = focus(three(), "projects");
    expect(deserialize(serialize(state))).toEqual(state);
    expect(serialize(setViewport(state, viewport))).not.toContain("viewport");
  });

  it("conserva la modalità richiesta, che non si salva", () => {
    expect(deserialize(serialize(three()), "mobile")?.layoutMode).toBe("mobile");
    expect(serialize(three())).not.toContain("layoutMode");
  });

  it.each([
    ["JSON non valido", "{"],
    ["versione diversa", JSON.stringify({ version: 2, windows: [], stack: [], recent: [] })],
    ["campi mancanti", JSON.stringify({ version: 1 })],
    [
      "app sconosciuta",
      JSON.stringify({
        version: 1,
        windows: [{ id: "x", maximized: false, minimized: false, geometry: null, cascade: 0 }],
        stack: ["x"],
        recent: ["x"],
      }),
    ],
    [
      "geometria non numerica",
      JSON.stringify({
        version: 1,
        windows: [
          { id: "cv", maximized: false, minimized: false, geometry: { x: "1" }, cascade: 0 },
        ],
        stack: ["cv"],
        recent: ["cv"],
      }),
    ],
    [
      "ordine incoerente con le finestre",
      JSON.stringify({
        version: 1,
        windows: [{ id: "cv", maximized: false, minimized: false, geometry: null, cascade: 0 }],
        stack: [],
        recent: ["cv"],
      }),
    ],
    ["valore non oggetto", "null"],
  ])("rifiuta %s", (_case, text) => {
    expect(deserialize(text)).toBeNull();
  });
});
