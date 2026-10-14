import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

// I controlli veri sono di tipo: `npm run typecheck` fallisce se una
// direttiva ts-expect-error qui sotto smette di servire.
describe("tipi di Button", () => {
  it("un pulsante con sola icona richiede aria-label", () => {
    // @ts-expect-error manca aria-label
    const withoutLabel = createElement(Button, { icon: "trash" });
    const withLabel = createElement(Button, { icon: "trash", "aria-label": "Svuota il cestino" });
    expect([withoutLabel, withLabel]).toHaveLength(2);
  });

  it("le icone dei pulsanti esistono a 16 px", () => {
    // @ts-expect-error l'icona di avviso esiste solo a 32 px
    const large = createElement(Button, { icon: "warning", "aria-label": "Attenzione" });
    expect(large).toBeDefined();
  });
});
