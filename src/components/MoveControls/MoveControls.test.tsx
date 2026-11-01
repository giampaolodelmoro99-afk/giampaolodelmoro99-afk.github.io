import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { type MoveDirection, MoveControls } from "./MoveControls";

function Controls(props: {
  onStep?: (direction: MoveDirection) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  return (
    <I18nProvider locale="it-IT">
      <MoveControls
        onStep={props.onStep ?? (() => {})}
        onConfirm={props.onConfirm ?? (() => {})}
        onCancel={props.onCancel ?? (() => {})}
      />
    </I18nProvider>
  );
}

describe("MoveControls", () => {
  it("è un gruppo con nome, quattro frecce, OK e Annulla", () => {
    render(<Controls />);
    expect(
      screen.getByRole("group", { name: "Spostamento e ridimensionamento" }),
    ).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("button")
        .map((button) => button.getAttribute("aria-label") ?? button.textContent),
    ).toEqual(["Su", "Sinistra", "Destra", "Giù", "OK", "Annulla"]);
  });

  it("segnala la direzione, la conferma e l'annullamento", async () => {
    const onStep = vi.fn<(direction: MoveDirection) => void>();
    const onConfirm = vi.fn<() => void>();
    const onCancel = vi.fn<() => void>();
    const user = userEvent.setup();
    render(<Controls onStep={onStep} onConfirm={onConfirm} onCancel={onCancel} />);
    await user.click(screen.getByRole("button", { name: "Destra" }));
    await user.click(screen.getByRole("button", { name: "Giù" }));
    await user.click(screen.getByRole("button", { name: "OK" }));
    await user.click(screen.getByRole("button", { name: "Annulla" }));
    expect(onStep.mock.calls.map(([direction]) => direction)).toEqual(["right", "down"]);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("non ha violazioni axe", async () => {
    const { container } = render(<Controls />);
    await expectNoAxeViolations(container);
  });
});
