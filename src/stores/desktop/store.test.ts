import { describe, expect, it } from "vitest";
import { initialStateFor } from "./state";
import { createDesktopStore } from "./store";

describe("store del desktop", () => {
  it("applica le azioni pure e crea istanze separate", () => {
    const store = createDesktopStore(initialStateFor("desktop"));
    const other = createDesktopStore(initialStateFor("desktop"));
    store.getState().open("projects");
    store.getState().focus("about");
    expect(store.getState().stack).toEqual(["projects", "about"]);
    store.getState().close("about");
    expect(store.getState().activeId).toBe("projects");
    expect(other.getState().stack).toEqual(["about"]);
  });
});
