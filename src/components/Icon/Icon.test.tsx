import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { Glyph } from "./Glyph";
import { Icon } from "./Icon";
import { glyphNames } from "./glyphData";
import { iconSizes } from "./iconData";

describe("Icon", () => {
  it("è decorativa senza etichetta", () => {
    const { container } = render(<Icon name="about" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
    expect(svg).not.toHaveAttribute("role");
  });

  it("ha ruolo img e nome accessibile con l'etichetta", () => {
    render(<Icon name="warning" label="Avviso" />);
    expect(screen.getByRole("img", { name: "Avviso" })).toBeInTheDocument();
  });

  it("usa 32 px se la dimensione non è indicata e scala solo per interi", () => {
    const { container } = render(
      <>
        <Icon name="cv" />
        <Icon name="cv" size={16} scale={2} />
        <Icon name="cv" size={16} scale={3} />
      </>,
    );
    const sizes = [...container.querySelectorAll("svg")].map((svg) => [
      svg.getAttribute("viewBox"),
      svg.getAttribute("width"),
    ]);
    expect(sizes).toEqual([
      ["0 0 32 32", "32"],
      ["0 0 16 16", "32"],
      ["0 0 16 16", "48"],
    ]);
  });

  it("disegna a pixel netti con il contorno per primo e i colori dai token", () => {
    const { container } = render(<Icon name="terminal" size={16} className="extra" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("shape-rendering", "crispEdges");
    expect(svg).toHaveClass("root", "extra");
    const roles = [...container.querySelectorAll("path")].map((path) => path.getAttribute("class"));
    expect(roles[0]).toBe("pixelOutline");
    expect(roles).toContain("pixelBlack");
  });

  it("esiste a 32 px per ogni nome e a 16 px per tutte tranne le icone dei dialoghi", () => {
    const only32 = Object.entries(iconSizes)
      .filter(([, sizes]) => !sizes.some((size) => size === 16))
      .map(([name]) => name);
    expect(only32.toSorted()).toEqual(["error", "info", "warning"]);
    expect(Object.values(iconSizes).every((sizes) => sizes.some((size) => size === 32))).toBe(true);
  });

  it("non ha violazioni axe, decorativa o con etichetta", async () => {
    const { container } = render(
      <p>
        <Icon name="contacts" /> <Icon name="error" label="Errore" />
      </p>,
    );
    await expectNoAxeViolations(container);
  });
});

describe("Glyph", () => {
  it("è decorativo e riceve le dimensioni in pixel come variabili CSS", () => {
    const { container } = render(<Glyph name="close" className="extra" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("viewBox", "0 0 8 7");
    expect(svg).toHaveClass("glyph", "extra");
    expect(svg?.style.getPropertyValue("--glyph-width")).toBe("8");
    expect(svg?.style.getPropertyValue("--glyph-height")).toBe("7");
  });

  it.each(glyphNames)("disegna il glifo %s", (name) => {
    const { container } = render(<Glyph name={name} />);
    expect(container.querySelector("path")?.getAttribute("d")).toMatch(/^M\d/);
  });
});
