import { afterEach, describe, expect, it, vi } from "vitest";
import { layoutStorageKey, readLayout, writeLayout } from "./persist";
import { emptyState, open, place, serialize } from "./state";

const layout = () =>
  place(open(open(emptyState, "about"), "cv"), "cv", { x: 10, y: 20, width: 300, height: 200 });

function fail(): never {
  throw new Error("storage bloccato");
}

function throwingStorage() {
  return { getItem: fail, setItem: fail, removeItem: fail };
}

describe("persistenza del layout", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("usa la chiave versionata windows.v1", () => {
    expect(layoutStorageKey).toBe("windows.v1");
  });

  it("scrive e rilegge finestre, geometria e ordine", () => {
    expect(writeLayout(layout())).toBe(serialize(layout()));
    expect(readLayout()).toMatchObject({
      stack: ["about", "cv"],
      recent: ["cv", "about"],
      activeId: "cv",
      windows: { cv: { geometry: { x: 10, y: 20, width: 300, height: 200 } } },
    });
  });

  it("senza nulla di salvato non c'è layout", () => {
    expect(readLayout()).toBeNull();
  });

  it("un valore non valido o di un'altra versione si ignora e si cancella", () => {
    localStorage.setItem(layoutStorageKey, "{non json");
    expect(readLayout()).toBeNull();
    expect(localStorage.getItem(layoutStorageKey)).toBeNull();
    localStorage.setItem(layoutStorageKey, JSON.stringify({ version: 2 }));
    expect(readLayout()).toBeNull();
    expect(localStorage.getItem(layoutStorageKey)).toBeNull();
  });

  it("con lo storage bloccato o assente il sito funziona senza layout salvato", () => {
    expect(readLayout(throwingStorage())).toBeNull();
    expect(writeLayout(layout(), throwingStorage())).toBeNull();
    expect(readLayout(null)).toBeNull();
    expect(writeLayout(layout(), null)).toBeNull();
    vi.stubGlobal("localStorage", undefined);
    expect(readLayout()).toBeNull();
  });
});
