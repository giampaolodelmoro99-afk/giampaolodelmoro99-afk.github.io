import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Key } from "react";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { MenuItem, MenuSeparator } from "../MenuBar";
import { StartButton } from "./StartButton";

function Start(props: { onAction?: (key: Key) => void; locale?: string }) {
  return (
    <I18nProvider locale={props.locale ?? "it-IT"}>
      <StartButton {...(props.onAction ? { onAction: props.onAction } : {})}>
        <MenuItem id="projects" icon="projects">
          Progetti
        </MenuItem>
        <MenuItem id="about" icon="about">
          Chi sono
        </MenuItem>
        <MenuSeparator />
        <MenuItem id="run" icon="run">
          Esegui…
        </MenuItem>
      </StartButton>
    </I18nProvider>
  );
}

describe("StartButton", () => {
  it("è un pulsante Start con il monogramma GDM e aria-expanded", () => {
    render(<Start />);
    const button = screen.getByRole("button", { name: "Start" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("apre il menu Start con nome, fascia decorativa nascosta e voci", async () => {
    const onAction = vi.fn<(key: Key) => void>();
    const user = userEvent.setup();
    render(<Start onAction={onAction} />);
    const button = screen.getByRole("button", { name: "Start" });
    await user.click(button);
    const menu = await screen.findByRole("menu", { name: "Start" });
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("gianpaolodelmoro").closest("[aria-hidden]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await user.click(within(menu).getByRole("menuitem", { name: "Chi sono" }));
    expect(onAction.mock.calls.map(([key]) => key)).toEqual(["about"]);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("il menu prende il nome dal pulsante, anche in inglese", async () => {
    render(<Start locale="en-US" />);
    await userEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(await screen.findByRole("menu", { name: "Start" })).toBeInTheDocument();
  });

  it("non ha violazioni axe, chiuso e aperto", async () => {
    const { container } = render(<Start />);
    await expectNoAxeViolations(container);
    await userEvent.click(screen.getByRole("button", { name: "Start" }));
    await expectNoAxeViolations(await screen.findByRole("menu"));
  });
});
