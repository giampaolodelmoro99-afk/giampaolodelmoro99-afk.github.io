import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { TextArea } from "./TextArea";

describe("TextArea", () => {
  it("è un'area di testo con etichetta, 5 righe predefinite e descrizione collegata", () => {
    render(<TextArea label="Messaggio" description="Almeno due righe" />);
    const area = screen.getByRole("textbox", { name: "Messaggio" });
    expect(area.tagName).toBe("TEXTAREA");
    expect(area).toHaveAttribute("rows", "5");
    expect(area).toHaveAccessibleDescription("Almeno due righe");
  });

  it("accetta più righe e un numero di righe diverso", async () => {
    render(<TextArea label="Messaggio" rows={8} />);
    const area = screen.getByRole("textbox", { name: "Messaggio" });
    expect(area).toHaveAttribute("rows", "8");
    await userEvent.type(area, "Ciao{Enter}Gianpaolo");
    expect(area).toHaveValue("Ciao\nGianpaolo");
  });

  it("collega l'errore", () => {
    render(<TextArea label="Messaggio" isInvalid errorMessage="Scrivi un messaggio" />);
    const area = screen.getByRole("textbox", { name: "Messaggio" });
    expect(area).toHaveAttribute("aria-invalid", "true");
    expect(area).toHaveAccessibleDescription("Scrivi un messaggio");
  });

  it("non ha violazioni axe", async () => {
    const { container } = render(
      <>
        <TextArea label="Messaggio" description="Almeno due righe" />
        <TextArea label="Disabilitata" isDisabled />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
