import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Key } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { MenuItem, MenuSeparator, Submenu } from "./Menu";
import { MenuBar, MenuButton } from "./MenuBar";

function Bar(props: { onAction?: (key: Key) => void }) {
  return (
    <MenuBar label="Menu della finestra">
      <MenuButton label="File" {...props}>
        <MenuItem id="new" shortcut="Ctrl+N">
          Nuovo
        </MenuItem>
        <MenuItem id="open" icon="projects">
          Apri
        </MenuItem>
        <MenuItem id="print" isDisabled>
          Stampa
        </MenuItem>
        <MenuSeparator />
        <Submenu label="Esporta">
          <MenuItem id="pdf">PDF</MenuItem>
          <MenuItem id="txt">Testo</MenuItem>
        </Submenu>
        <MenuItem id="close">Chiudi</MenuItem>
      </MenuButton>
      <MenuButton label="Visualizza" selectionMode="single" defaultSelectedKeys={["icons"]}>
        <MenuItem id="icons">Icone grandi</MenuItem>
        <MenuItem id="list">Elenco</MenuItem>
      </MenuButton>
    </MenuBar>
  );
}

describe("MenuBar", () => {
  it("è una toolbar con nome e un pulsante per menu; le frecce passano da un menu all'altro", async () => {
    const user = userEvent.setup();
    render(<Bar />);
    expect(screen.getByRole("toolbar", { name: "Menu della finestra" })).toBeInTheDocument();
    await user.tab();
    expect(screen.getByRole("button", { name: "File" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Visualizza" })).toHaveFocus();
  });

  it("freccia giù apre il menu, Invio sceglie una voce, il menu si chiude", async () => {
    const onAction = vi.fn<(key: Key) => void>();
    const user = userEvent.setup();
    render(<Bar onAction={onAction} />);
    const file = screen.getByRole("button", { name: "File" });
    await user.tab();
    await user.keyboard("{ArrowDown}");
    const menu = await screen.findByRole("menu");
    expect(file).toHaveAttribute("aria-expanded", "true");
    expect(within(menu).getByRole("menuitem", { name: /Nuovo/ })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onAction.mock.calls.map(([key]) => key)).toEqual(["new"]);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });

  it("Esc chiude il menu e riporta il focus al pulsante", async () => {
    const user = userEvent.setup();
    render(<Bar />);
    const file = screen.getByRole("button", { name: "File" });
    await user.click(file);
    await screen.findByRole("menu");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    await waitFor(() => expect(file).toHaveFocus());
  });

  it("mostra scorciatoia, voce disabilitata e sottomenu", async () => {
    const user = userEvent.setup();
    render(<Bar />);
    await user.click(screen.getByRole("button", { name: "File" }));
    const menu = await screen.findByRole("menu");
    expect(within(menu).getByRole("menuitem", { name: /Nuovo/ })).toHaveTextContent("Ctrl+N");
    expect(within(menu).getByRole("menuitem", { name: "Stampa" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    const exportItem = within(menu).getByRole("menuitem", { name: "Esporta" });
    expect(exportItem).toHaveAttribute("aria-haspopup", "menu");
    await user.click(exportItem);
    expect(await screen.findByRole("menuitem", { name: "PDF" })).toBeInTheDocument();
  });

  it("con selectionMode le voci hanno lo stato di spunta", async () => {
    const user = userEvent.setup();
    render(<Bar />);
    await user.click(screen.getByRole("button", { name: "Visualizza" }));
    const menu = await screen.findByRole("menu");
    expect(within(menu).getByRole("menuitemradio", { name: "Icone grandi" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(within(menu).getByRole("menuitemradio", { name: "Elenco" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("non ha violazioni axe, chiuso e aperto", async () => {
    const { container } = render(<Bar />);
    await expectNoAxeViolations(container);
    await userEvent.click(screen.getByRole("button", { name: "File" }));
    await expectNoAxeViolations(await screen.findByRole("menu"));
  });
});
