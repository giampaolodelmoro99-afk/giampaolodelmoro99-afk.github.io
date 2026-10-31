import { describe, expect, it } from "vitest";
import { normalizeCommand, resolveCommand } from "./run";

describe("comandi di Esegui", () => {
  it.each([
    ["progetti", "projects"],
    ["Projects", "projects"],
    ["  CV ", "cv"],
    ["contatti", "contacts"],
    ["contact", "contacts"],
    ["profilo", "about"],
    ["about", "about"],
    ["stack", "skills"],
    ["vista-semplice", "simpleView"],
    ["Vista semplice", "simpleView"],
    ["pannello di controllo", "controlPanel"],
    ["campo minato", "minefield"],
    ["Making of", "makingOf"],
    ["terminale", "terminal"],
    ["cestino", "trash"],
  ] as const)("riconosce «%s»", (text, id) => {
    expect(resolveCommand(text)).toBe(id);
  });

  it.each(["", "   ", "xyz", "progetto", "pro"])("non riconosce «%s»", (text) => {
    expect(resolveCommand(text)).toBeNull();
  });

  it("normalizza accenti, maiuscole, trattini e punteggiatura", () => {
    expect(normalizeCommand("  Proprietà-Del_Sito!  ")).toBe("proprieta del sito");
  });
});
