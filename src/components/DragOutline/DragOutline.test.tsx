import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { DragOutline } from "./DragOutline";

const rect = { x: 120, y: 40, width: 320, height: 200 };

describe("DragOutline", () => {
  it("è decorativo e riceve posizione e misura come variabili CSS", () => {
    const { container } = render(<DragOutline rect={rect} className="extra" />);
    const outline = container.firstElementChild;
    expect(outline).toHaveAttribute("aria-hidden", "true");
    expect(outline).toHaveClass("root", "extra");
    expect(outline instanceof HTMLElement && outline.style.getPropertyValue("--outline-x")).toBe(
      "120px",
    );
    expect(outline instanceof HTMLElement && outline.style.getPropertyValue("--outline-h")).toBe(
      "200px",
    );
  });

  it("si usa solo dopo l'idratazione: con il rendering lato server avrebbe un attributo style", () => {
    expect(renderToString(<DragOutline rect={rect} />)).toMatch(/style="--outline-x:120px/);
  });

  it("non ha violazioni axe", async () => {
    const { container } = render(<DragOutline rect={rect} />);
    await expectNoAxeViolations(container);
  });
});
