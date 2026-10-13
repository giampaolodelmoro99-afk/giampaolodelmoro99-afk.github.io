import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { renderAt } from "../../../tests/setup/render";
import { NotFound } from "./NotFound";

describe("NotFound", () => {
  it("spiega l'errore in italiano e in inglese con i link alle due home", () => {
    renderAt("/sconosciuta", NotFound);
    expect(
      screen.getByRole("heading", { level: 1, name: "Pagina non trovata" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/does not exist/)).toHaveAttribute("lang", "en");
    expect(screen.getByRole("link", { name: "Torna alla home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Back to the home page" })).toHaveAttribute(
      "href",
      "/en/",
    );
  });

  it("non ha violazioni axe", async () => {
    const { container } = renderAt("/sconosciuta", NotFound);
    await expectNoAxeViolations(container);
  });
});
