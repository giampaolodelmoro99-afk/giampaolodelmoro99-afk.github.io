import { describe, expect, it } from "vitest";
import { backPathOf, pathFor, represents, samePath } from "./url";

describe("URL delle finestre", () => {
  it("l'URL è quello della finestra attiva, o la home senza finestre", () => {
    expect(pathFor("projects", "desktop", "it")).toBe("/progetti/");
    expect(pathFor("projects", "about", "en")).toBe("/en/projects/");
    expect(pathFor(null, "projects", "it")).toBe("/");
    expect(pathFor(null, "projects", "en")).toBe("/en/");
  });

  it("non naviga se la route corrente rappresenta già la finestra attiva", () => {
    expect(pathFor("about", "desktop", "it")).toBeNull();
    expect(pathFor("about", "about", "it")).toBeNull();
    expect(pathFor(null, "desktop", "en")).toBeNull();
    expect(pathFor("about", "projects", "it")).toBe("/profilo/");
  });

  it("legge la voce precedente dallo stato della history solo se è una stringa", () => {
    expect(backPathOf({ back: "/progetti/" })).toBe("/progetti/");
    expect(backPathOf({ back: 3 })).toBeNull();
    expect(backPathOf(null)).toBeNull();
    expect(backPathOf("x")).toBeNull();
  });

  it("confronta i percorsi senza badare allo slash finale", () => {
    expect(samePath("/progetti", "/progetti/")).toBe(true);
    expect(samePath("/", "/")).toBe(true);
    expect(samePath("/cv/", "/progetti/")).toBe(false);
  });

  it("una voce rappresenta una finestra se la sua route la apre: la home rappresenta About", () => {
    expect(represents("/", "about")).toBe(true);
    expect(represents("/profilo/", "about")).toBe(true);
    expect(represents("/", null)).toBe(true);
    expect(represents("/progetti/", null)).toBe(false);
    expect(represents("/en/projects/", "projects")).toBe(true);
    expect(represents("/inesistente/", "projects")).toBe(false);
  });
});
