import { describe, expect, it } from "vitest";
import { type ShortcutEvent, isApplePlatform, isTextEntry, matchShortcut } from "./shortcuts";

function press(
  key: string,
  code: string,
  modifiers: Partial<Pick<ShortcutEvent, "altKey" | "ctrlKey" | "metaKey" | "shiftKey">> = {},
  altGraph = false,
): ShortcutEvent {
  return {
    key,
    code,
    altKey: true,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    ...modifiers,
    getModifierState: (name: string) => name === "AltGraph" && altGraph,
  };
}

describe("scorciatoie", () => {
  it.each([
    ["Alt+W su QWERTY", press("w", "KeyW"), "switcherNext"],
    ["Maiusc+Alt+W", press("W", "KeyW", { shiftKey: true }), "switcherPrevious"],
    ["⌥W su Mac, che scrive ∑", press("∑", "KeyW"), "switcherNext"],
    ["Maiusc+⌥W su Mac", press("„", "KeyW", { shiftKey: true }), "switcherPrevious"],
    ["Alt+W su un layout cirillico", press("ц", "KeyW"), "switcherNext"],
    ["Alt+W su AZERTY (tasto KeyZ)", press("w", "KeyZ"), "switcherNext"],
    ["Alt+Spazio", press(" ", "Space"), "windowMenu"],
    ["⌥Spazio su Mac (spazio non separabile)", press("\u00a0", "Space"), "windowMenu"],
    ["Alt+trattino", press("-", "Minus"), "windowMenu"],
    ["Alt+trattino sul layout italiano (tasto Slash)", press("-", "Slash"), "windowMenu"],
    ["⌥- su Mac, che scrive –", press("–", "Minus"), "windowMenu"],
  ] as const)("riconosce %s", (_name, event, action) => {
    expect(matchShortcut(event)).toBe(action);
  });

  it.each([
    ["senza Alt", press("w", "KeyW", { altKey: false })],
    ["con Ctrl", press("w", "KeyW", { ctrlKey: true })],
    ["con Cmd", press("w", "KeyW", { metaKey: true })],
    ["con AltGr", press("w", "KeyW", {}, true)],
    ["Alt+Z su AZERTY, sul tasto KeyW", press("z", "KeyW")],
    ["Alt+apostrofo sul layout italiano, sul tasto Minus", press("'", "Minus")],
    ["un altro tasto", press("q", "KeyQ")],
  ] as const)("ignora %s", (_name, event) => {
    expect(matchShortcut(event)).toBeNull();
  });

  it("non scatta nei campi di testo e nel Terminale", () => {
    document.body.innerHTML =
      '<input id="a"><textarea id="b"></textarea><div contenteditable="true" id="c"></div><div data-shortcuts="off"><p id="d"></p></div><button id="e"></button>';
    for (const id of ["a", "b", "c", "d"]) {
      expect(isTextEntry(document.getElementById(id))).toBe(true);
    }
    expect(isTextEntry(document.getElementById("e"))).toBe(false);
    expect(isTextEntry(null)).toBe(false);
  });

  it("riconosce le piattaforme Apple", () => {
    expect(typeof isApplePlatform()).toBe("boolean");
  });
});
