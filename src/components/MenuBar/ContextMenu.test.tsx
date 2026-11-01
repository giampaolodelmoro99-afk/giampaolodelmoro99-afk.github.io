import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Key } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { ContextMenu } from "./ContextMenu";
import { MenuItem, MenuSeparator, Submenu } from "./Menu";

function Desktop(props: { onAction?: (key: Key) => void; onOpenChange?: (open: boolean) => void }) {
  return (
    <ContextMenu
      isOpen
      onOpenChange={props.onOpenChange ?? (() => {})}
      x={120}
      y={80}
      label="Desktop"
      {...(props.onAction ? { onAction: props.onAction } : {})}
    >
      <Submenu label="Disponi icone">
        <MenuItem id="name">Per nome</MenuItem>
      </Submenu>
      <MenuItem id="refresh">Aggiorna</MenuItem>
      <MenuSeparator />
      <MenuItem id="properties">Proprietà</MenuItem>
    </ContextMenu>
  );
}

describe("ContextMenu", () => {
  it("si apre nel punto indicato con il focus sulla prima voce", async () => {
    render(<Desktop />);
    const menu = await screen.findByRole("menu", { name: "Desktop" });
    expect(menu).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Disponi icone" })).toHaveFocus(),
    );
    const anchor = document.querySelector<HTMLElement>("[style*='--anchor-x']");
    expect(anchor?.style.getPropertyValue("--anchor-x")).toBe("120px");
  });

  it("esegue le voci e si chiude con Esc", async () => {
    const onAction = vi.fn<(key: Key) => void>();
    const onOpenChange = vi.fn<(open: boolean) => void>();
    const user = userEvent.setup();
    render(<Desktop onAction={onAction} onOpenChange={onOpenChange} />);
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Disponi icone" })).toHaveFocus(),
    );
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Aggiorna" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onAction.mock.calls.map(([key]) => key)).toEqual(["refresh"]);
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("non ha violazioni axe", async () => {
    render(<Desktop />);
    await screen.findByRole("menu");
    await expectNoAxeViolations(document.body);
  });

  it("una voce con opensDialog dichiara aria-haspopup=dialog, le altre no", async () => {
    render(
      <ContextMenu isOpen onOpenChange={() => {}} x={0} y={0} label="Start">
        <MenuItem id="run" opensDialog>
          Esegui…
        </MenuItem>
        <MenuItem id="about">About</MenuItem>
      </ContextMenu>,
    );
    expect(await screen.findByRole("menuitem", { name: "Esegui…" })).toHaveAttribute(
      "aria-haspopup",
      "dialog",
    );
    expect(screen.getByRole("menuitem", { name: "About" })).not.toHaveAttribute("aria-haspopup");
    await expectNoAxeViolations(document.body);
  });
});
