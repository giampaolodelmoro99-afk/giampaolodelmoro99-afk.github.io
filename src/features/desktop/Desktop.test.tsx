import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { renderAt } from "../../../tests/setup/render";
import { Desktop } from "./Desktop";

describe("Desktop", () => {
  it("mostra nome e collegamento alla versione inglese sulla route italiana", () => {
    renderAt("/", Desktop);
    expect(
      screen.getByRole("heading", { level: 1, name: "Gianpaolo Del Moro" }),
    ).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "English version" });
    expect(link).toHaveAttribute("href", "/en/");
    expect(link).toHaveAttribute("lang", "en");
  });

  it("mostra il collegamento alla versione italiana sulla route inglese", () => {
    renderAt("/en/", Desktop);
    expect(screen.getByText(/under construction/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Versione italiana" })).toHaveAttribute("href", "/");
  });

  it("non ha violazioni axe", async () => {
    const { container } = renderAt("/", Desktop);
    await expectNoAxeViolations(container);
  });
});
