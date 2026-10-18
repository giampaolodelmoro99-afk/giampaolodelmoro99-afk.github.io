import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("è una casella con il nome dall'etichetta", () => {
    render(<Checkbox>Mostra i secondi</Checkbox>);
    expect(screen.getByRole("checkbox", { name: "Mostra i secondi" })).not.toBeChecked();
  });

  it("si seleziona con un clic sull'etichetta e con Spazio", async () => {
    const onChange = vi.fn<(isSelected: boolean) => void>();
    const user = userEvent.setup();
    render(<Checkbox onChange={onChange}>Mostra i secondi</Checkbox>);
    const checkbox = screen.getByRole("checkbox", { name: "Mostra i secondi" });
    await user.click(screen.getByText("Mostra i secondi"));
    expect(checkbox).toBeChecked();
    await user.keyboard(" ");
    expect(checkbox).not.toBeChecked();
    expect(onChange.mock.calls).toEqual([[true], [false]]);
  });

  it("indeterminata espone lo stato misto", () => {
    render(<Checkbox isIndeterminate>Seleziona tutto</Checkbox>);
    const checkbox = screen.getByRole("checkbox", { name: "Seleziona tutto" });
    expect(checkbox).toBePartiallyChecked();
    expect(checkbox.closest("label")).toHaveAttribute("data-indeterminate", "true");
  });

  it("disabilitata non cambia", async () => {
    render(<Checkbox isDisabled>Disabilitata</Checkbox>);
    const disabled = screen.getByRole("checkbox", { name: "Disabilitata" });
    await userEvent.click(screen.getByText("Disabilitata"));
    expect(disabled).not.toBeChecked();
    expect(disabled).toBeDisabled();
  });

  it("mostra la spunta solo da selezionata", () => {
    const { container, rerender } = render(<Checkbox>Opzione</Checkbox>);
    expect(container.querySelector("svg")).toBeNull();
    rerender(<Checkbox isSelected>Opzione</Checkbox>);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("segna il focus da tastiera", async () => {
    render(<Checkbox>Opzione</Checkbox>);
    await userEvent.tab();
    expect(screen.getByRole("checkbox").closest("label")).toHaveAttribute(
      "data-focus-visible",
      "true",
    );
  });

  it("non ha violazioni axe", async () => {
    const { container } = render(
      <>
        <Checkbox>Normale</Checkbox>
        <Checkbox defaultSelected>Selezionata</Checkbox>
        <Checkbox isIndeterminate>Indeterminata</Checkbox>
        <Checkbox isDisabled>Disabilitata</Checkbox>
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
