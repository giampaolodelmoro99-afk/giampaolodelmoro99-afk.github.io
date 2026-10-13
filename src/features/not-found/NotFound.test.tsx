import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
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

  it("usa il Link di React Aria e naviga con React Router senza ricaricare", async () => {
    const Stub = createRoutesStub([
      { path: "/en/", Component: () => <p>English home</p> },
      { path: "*", Component: NotFound },
    ]);
    render(<Stub initialEntries={["/sconosciuta"]} />);
    const link = screen.getByRole("link", { name: "Back to the home page" });
    expect(link).toHaveAttribute("data-react-aria-pressable", "true");
    expect(link).toHaveAttribute("hreflang", "en");
    await userEvent.click(link);
    expect(screen.getByText("English home")).toBeInTheDocument();
  });

  it("non ha violazioni axe", async () => {
    const { container } = renderAt("/sconosciuta", NotFound);
    await expectNoAxeViolations(container);
  });
});
