import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("prende il nome dall'etichetta e collega la descrizione", () => {
    render(<TextField label="Nome" description="Come vuoi essere chiamato" />);
    const input = screen.getByRole("textbox", { name: "Nome" });
    expect(input).toHaveAccessibleDescription("Come vuoi essere chiamato");
  });

  it("scrive e chiama onChange", async () => {
    const onChange = vi.fn<(value: string) => void>();
    render(<TextField label="Nome" onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox", { name: "Nome" }), "Ada");
    expect(onChange).toHaveBeenLastCalledWith("Ada");
  });

  it("collega il messaggio d'errore e segna lo stato non valido", () => {
    render(
      <TextField
        label="Email"
        description="Ti rispondo qui"
        isInvalid
        errorMessage="Manca il dominio, per esempio nome@dominio.it"
      />,
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-invalid", "true");
    expect(input).toHaveAccessibleDescription(
      "Ti rispondo qui Manca il dominio, per esempio nome@dominio.it",
    );
  });

  it("valida type email e isRequired all'invio del modulo, con il messaggio dato", async () => {
    const user = userEvent.setup();
    render(
      <form>
        <TextField
          label="Email"
          type="email"
          isRequired
          errorMessage={({ validationDetails }) =>
            validationDetails.valueMissing ? "Scrivi la tua email" : "Email non valida"
          }
        />
        <button type="submit">Invia</button>
      </form>,
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    await user.click(screen.getByRole("button", { name: "Invia" }));
    expect(input).toHaveAccessibleDescription("Scrivi la tua email");
    expect(input).toHaveFocus();
    await user.type(input, "nome");
    await user.click(screen.getByRole("button", { name: "Invia" }));
    expect(input).toHaveAccessibleDescription("Email non valida");
  });

  it("segna il focus anche con il mouse", async () => {
    render(<TextField label="Nome" />);
    const input = screen.getByRole("textbox", { name: "Nome" });
    await userEvent.click(input);
    expect(input).toHaveAttribute("data-focused", "true");
  });

  it("disabilitato e sola lettura", async () => {
    render(
      <>
        <TextField label="Disabilitato" isDisabled defaultValue="a" />
        <TextField label="Sola lettura" isReadOnly defaultValue="b" />
      </>,
    );
    expect(screen.getByRole("textbox", { name: "Disabilitato" })).toBeDisabled();
    const readOnly = screen.getByRole("textbox", { name: "Sola lettura" });
    expect(readOnly).toHaveAttribute("readonly");
    await userEvent.type(readOnly, "x");
    expect(readOnly).toHaveValue("b");
  });

  it("non ha violazioni axe", async () => {
    const { container } = render(
      <>
        <TextField label="Nome" description="Come vuoi essere chiamato" />
        <TextField label="Email" isInvalid errorMessage="Email non valida" />
        <TextField label="Disabilitato" isDisabled />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
