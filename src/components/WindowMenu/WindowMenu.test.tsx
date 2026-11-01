import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { type WindowMenuAction, WindowMenu } from "./WindowMenu";

function Menu(props: {
  isMaximized?: boolean;
  onAction?: (action: WindowMenuAction) => void;
  locale?: string;
}) {
  return (
    <I18nProvider locale={props.locale ?? "it-IT"}>
      <WindowMenu
        icon="projects"
        isMaximized={props.isMaximized ?? false}
        onAction={props.onAction ?? (() => {})}
      />
    </I18nProvider>
  );
}

describe("WindowMenu", () => {
  it("è un pulsante icona con nome e il menu chiuso", () => {
    render(<Menu />);
    const button = screen.getByRole("button", { name: "Menu della finestra" });
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("offre le voci della finestra, con Ripristina disattivata se non è ingrandita", async () => {
    const onAction = vi.fn<(action: WindowMenuAction) => void>();
    const user = userEvent.setup();
    render(<Menu onAction={onAction} />);
    await user.click(screen.getByRole("button", { name: "Menu della finestra" }));
    const menu = await screen.findByRole("menu", { name: "Menu della finestra" });
    const items = within(menu).getAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Ripristina",
      "Sposta",
      "Ridimensiona",
      "Riduci a icona",
      "Ingrandisci",
      "Chiudi",
    ]);
    expect(within(menu).getByRole("menuitem", { name: "Ripristina" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(within(menu).getByRole("menuitem", { name: "Chiudi" })).toHaveAttribute(
      "data-default",
      "true",
    );
    await user.click(within(menu).getByRole("menuitem", { name: "Sposta" }));
    expect(onAction).toHaveBeenCalledWith("move");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("da ingrandita disattiva Sposta, Ridimensiona e Ingrandisci", async () => {
    const user = userEvent.setup();
    render(<Menu isMaximized />);
    await user.click(screen.getByRole("button", { name: "Menu della finestra" }));
    const menu = await screen.findByRole("menu");
    for (const name of ["Sposta", "Ridimensiona", "Ingrandisci"]) {
      expect(within(menu).getByRole("menuitem", { name })).toHaveAttribute("aria-disabled", "true");
    }
    expect(within(menu).getByRole("menuitem", { name: "Ripristina" })).not.toHaveAttribute(
      "aria-disabled",
    );
  });

  it("da tastiera si apre sulla prima voce attiva e Esc riporta il focus sul pulsante", async () => {
    const user = userEvent.setup();
    render(<Menu />);
    const button = screen.getByRole("button", { name: "Menu della finestra" });
    button.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("menuitem", { name: "Sposta" })).toHaveFocus();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(button).toHaveFocus());
  });

  it("parla inglese con React Aria in inglese", async () => {
    const user = userEvent.setup();
    render(<Menu locale="en-US" />);
    await user.click(screen.getByRole("button", { name: "Window menu" }));
    expect(await screen.findByRole("menuitem", { name: "Size" })).toBeInTheDocument();
  });

  it("non ha violazioni axe, chiuso e aperto", async () => {
    const user = userEvent.setup();
    const { container } = render(<Menu />);
    await expectNoAxeViolations(container);
    await user.click(screen.getByRole("button", { name: "Menu della finestra" }));
    await expectNoAxeViolations(document.body);
  });
});
