import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { StatusBar } from "./StatusBar";

const fields = [
  { id: "items", text: "12 oggetti", grow: true },
  { id: "size", text: "3,4 MB" },
];

describe("StatusBar", () => {
  it("è un gruppo con nome e un campo per ogni voce", () => {
    render(<StatusBar label="Barra di stato" fields={fields} />);
    const group = screen.getByRole("group", { name: "Barra di stato" });
    expect(group).toHaveTextContent("12 oggetti3,4 MB");
    expect(screen.getByText("12 oggetti")).toHaveAttribute("data-grow", "true");
    expect(screen.getByText("3,4 MB")).not.toHaveAttribute("data-grow");
  });

  it("non annuncia i cambiamenti da sola: nessun aria-live implicito", () => {
    const { container } = render(<StatusBar label="Barra di stato" fields={fields} />);
    expect(container.querySelector("[aria-live]")).toBeNull();
    expect(screen.getByRole("group")).not.toHaveAttribute("role", "status");
  });

  it("non ha violazioni axe", async () => {
    const { container } = render(<StatusBar label="Barra di stato" fields={fields} />);
    await expectNoAxeViolations(container);
  });
});
