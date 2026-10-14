import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { Button } from "../Button";
import { Tooltip, tooltipDelay } from "./Tooltip";

function Example() {
  return (
    <Tooltip text="Svuota il cestino">
      <Button icon="trash" aria-label="Svuota il cestino" />
    </Tooltip>
  );
}

describe("Tooltip", () => {
  it("ha un ritardo di 600 ms come nel 95", () => {
    expect(tooltipDelay).toBe(600);
  });

  it("compare subito con il focus da tastiera e descrive il pulsante", async () => {
    render(<Example />);
    await userEvent.tab();
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Svuota il cestino");
    expect(screen.getByRole("button", { name: "Svuota il cestino" })).toHaveAttribute(
      "aria-describedby",
      tooltip.id,
    );
  });

  it("Esc lo chiude", async () => {
    render(<Example />);
    await userEvent.tab();
    await screen.findByRole("tooltip");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  });

  it("non ha violazioni axe da aperto", async () => {
    const { container } = render(<Example />);
    await userEvent.tab();
    const tooltip = await screen.findByRole("tooltip");
    await expectNoAxeViolations(container);
    await expectNoAxeViolations(tooltip);
  });
});
