import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { Radio, RadioGroup } from "./Radio";

function Theme(props: { onChange?: (value: string) => void; isDisabled?: boolean }) {
  return (
    <RadioGroup label="Tema" defaultValue="classic" {...props}>
      <Radio value="classic">Classico</Radio>
      <Radio value="high-contrast">Alto contrasto</Radio>
      <Radio value="auto" isDisabled>
        Di sistema
      </Radio>
    </RadioGroup>
  );
}

describe("RadioGroup e Radio", () => {
  it("è un gruppo con nome dall'etichetta e opzioni con nome", () => {
    render(<Theme />);
    expect(screen.getByRole("radiogroup", { name: "Tema" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Classico" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Alto contrasto" })).not.toBeChecked();
  });

  it("le frecce spostano la selezione e saltano le opzioni disabilitate", async () => {
    const onChange = vi.fn<(value: string) => void>();
    const user = userEvent.setup();
    render(<Theme onChange={onChange} />);
    await user.tab();
    expect(screen.getByRole("radio", { name: "Classico" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Alto contrasto" })).toBeChecked();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Classico" })).toBeChecked();
    expect(onChange.mock.calls).toEqual([["high-contrast"], ["classic"]]);
  });

  it("Tab entra nel gruppo sull'opzione selezionata ed esce al controllo successivo", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Prima</button>
        <RadioGroup label="Tema" defaultValue="high-contrast">
          <Radio value="classic">Classico</Radio>
          <Radio value="high-contrast">Alto contrasto</Radio>
        </RadioGroup>
        <button type="button">Dopo</button>
      </>,
    );
    await user.tab();
    await user.tab();
    expect(screen.getByRole("radio", { name: "Alto contrasto" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Dopo" })).toHaveFocus();
  });

  it("si seleziona con un clic sull'etichetta", async () => {
    render(<Theme />);
    await userEvent.click(screen.getByText("Alto contrasto"));
    expect(screen.getByRole("radio", { name: "Alto contrasto" })).toBeChecked();
  });

  it("dichiara orientamento ed errore del gruppo", () => {
    render(
      <RadioGroup
        label="Lingua"
        orientation="horizontal"
        isInvalid
        errorMessage="Scegli una lingua"
      >
        <Radio value="it">Italiano</Radio>
        <Radio value="en">English</Radio>
      </RadioGroup>,
    );
    const group = screen.getByRole("radiogroup", { name: "Lingua" });
    expect(group).toHaveAttribute("aria-orientation", "horizontal");
    expect(group).toHaveAccessibleDescription("Scegli una lingua");
  });

  it("non ha violazioni axe", async () => {
    const { container } = render(<Theme />);
    await expectNoAxeViolations(container);
  });
});
