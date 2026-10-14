import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { Button } from "./Button";

describe("Button", () => {
  it("è un pulsante con il nome dall'etichetta", () => {
    render(<Button>Invia</Button>);
    expect(screen.getByRole("button", { name: "Invia" })).toHaveAttribute("type", "button");
  });

  it("chiama onPress con clic, Invio e Spazio", async () => {
    const onPress = vi.fn<() => void>();
    const user = userEvent.setup();
    render(<Button onPress={onPress}>OK</Button>);
    const button = screen.getByRole("button", { name: "OK" });
    await user.click(button);
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onPress).toHaveBeenCalledTimes(3);
  });

  it("disabilitato non chiama onPress e lo dichiara", async () => {
    const onPress = vi.fn<() => void>();
    render(
      <Button onPress={onPress} isDisabled>
        OK
      </Button>,
    );
    const button = screen.getByRole("button", { name: "OK" });
    await userEvent.click(button);
    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("data-disabled", "true");
  });

  it("segna la variante predefinita e lo stato premuto", async () => {
    const user = userEvent.setup();
    render(<Button variant="default">Salva</Button>);
    const button = screen.getByRole("button", { name: "Salva" });
    expect(button).toHaveAttribute("data-variant", "default");
    await user.pointer({ keys: "[MouseLeft>]", target: button });
    expect(button).toHaveAttribute("data-pressed", "true");
    await user.pointer({ keys: "[/MouseLeft]", target: button });
    expect(button).not.toHaveAttribute("data-pressed");
  });

  it("non segna la variante normale", () => {
    render(<Button>Annulla</Button>);
    expect(screen.getByRole("button", { name: "Annulla" })).not.toHaveAttribute("data-variant");
  });

  it("segna il focus da tastiera", async () => {
    const user = userEvent.setup();
    render(<Button>OK</Button>);
    await user.tab();
    expect(screen.getByRole("button", { name: "OK" })).toHaveAttribute(
      "data-focus-visible",
      "true",
    );
  });

  it("rende l'icona decorativa accanto all'etichetta", () => {
    render(<Button icon="run">Esegui</Button>);
    const button = screen.getByRole("button", { name: "Esegui" });
    const icon = button.querySelector("svg");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("width", "16");
  });

  it("con sola icona prende il nome da aria-label", () => {
    render(<Button icon="trash" aria-label="Svuota il cestino" />);
    expect(screen.getByRole("button", { name: "Svuota il cestino" })).toBeInTheDocument();
  });

  it("usa il Button di React Aria (stile di usePress da global.css, ADR-0012)", () => {
    render(<Button>OK</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-react-aria-pressable", "true");
  });

  it("non ha violazioni axe", async () => {
    const { container } = render(
      <>
        <Button>OK</Button>
        <Button variant="default">Salva</Button>
        <Button isDisabled>Annulla</Button>
        <Button icon="trash" aria-label="Svuota il cestino" />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
