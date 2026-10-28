import { describe, expect, it } from "vitest";
import {
  type DesktopState,
  close,
  deserialize,
  emptyState,
  focus,
  initialStateFor,
  open,
  openAppFor,
  serialize,
  zIndexOf,
} from "./state";

const three = (): DesktopState => open(open(open(emptyState, "about"), "projects"), "terminal");

describe("stato del desktop", () => {
  it("parte dall'URL: About sulla home, l'app della route altrove", () => {
    expect(openAppFor("desktop")).toBe("about");
    expect(initialStateFor("desktop")).toMatchObject({
      stack: ["about"],
      recent: ["about"],
      activeId: "about",
      windows: { about: { status: "normal", geometry: null, cascade: 0 } },
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
      windows: { ...base.windows, about: { ...base.windows.about!, status: "minimized" } },
    };
    expect(focus(minimized, "about").windows.about?.status).toBe("normal");
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
      windows: { ...base.windows, projects: { ...base.windows.projects!, status: "minimized" } },
    };
    expect(close(state, "terminal").activeId).toBe("about");
  });
});

describe("serializzazione (persistenza della 2B)", () => {
  it("va e torna senza perdere nulla", () => {
    const state = focus(three(), "projects");
    expect(deserialize(serialize(state))).toEqual(state);
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
        windows: [{ id: "x", status: "normal", geometry: null, restore: null, cascade: 0 }],
        stack: ["x"],
        recent: ["x"],
      }),
    ],
    [
      "geometria non numerica",
      JSON.stringify({
        version: 1,
        windows: [{ id: "cv", status: "normal", geometry: { x: "1" }, restore: null, cascade: 0 }],
        stack: ["cv"],
        recent: ["cv"],
      }),
    ],
    [
      "ordine incoerente con le finestre",
      JSON.stringify({
        version: 1,
        windows: [{ id: "cv", status: "normal", geometry: null, restore: null, cascade: 0 }],
        stack: [],
        recent: ["cv"],
      }),
    ],
    ["valore non oggetto", "null"],
  ])("rifiuta %s", (_case, text) => {
    expect(deserialize(text)).toBeNull();
  });
});
