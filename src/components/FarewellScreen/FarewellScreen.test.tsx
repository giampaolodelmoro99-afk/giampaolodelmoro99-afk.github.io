import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { FarewellScreen } from "./FarewellScreen";

const texts = {
  heading: "Puoi chiudere questa scheda.",
  message: "Il desktop è spento.",
  restartLabel: "Riaccendi",
  footer: "gianpaolodelmoro.it",
};

describe("FarewellScreen", () => {
  it("è il contenuto principale con il titolo e il focus su Riaccendi", () => {
    render(<FarewellScreen {...texts} onRestart={() => {}} />);
    expect(screen.getByRole("main")).toContainElement(
      screen.getByRole("heading", { level: 1, name: "Puoi chiudere questa scheda." }),
    );
    expect(screen.getByRole("button", { name: "Riaccendi" })).toHaveFocus();
    expect(screen.getByText("gianpaolodelmoro.it")).toBeInTheDocument();
  });

  it("Riaccendi da tastiera chiama onRestart", async () => {
    const onRestart = vi.fn<() => void>();
    const user = userEvent.setup();
    render(<FarewellScreen {...texts} onRestart={onRestart} />);
    await user.keyboard("{Enter}");
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it("non ha violazioni axe", async () => {
    const { container } = render(<FarewellScreen {...texts} onRestart={() => {}} />);
    await expectNoAxeViolations(container);
  });
});
