import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../../tests/setup/axe";
import { AppSwitcher, type AppSwitcherItem } from "./AppSwitcher";

const initial: AppSwitcherItem[] = [
  { id: "projects", label: "Progetti", icon: "projects" },
  { id: "about", label: "About", icon: "about" },
  { id: "cv", label: "CV", icon: "cv" },
];

type Handlers = {
  onOpen?: (id: string) => void;
  onCloseAll?: () => void;
  onOpenChange?: (isOpen: boolean) => void;
};

function Harness({ onOpen, onCloseAll, onOpenChange }: Handlers) {
  const [items, setItems] = useState(initial);
  return (
    <I18nProvider locale="it-IT">
      <AppSwitcher
        isOpen
        onOpenChange={onOpenChange ?? (() => undefined)}
        title={`App aperte (${items.length})`}
        items={items}
        currentId="projects"
        closeLabel={(label) => `Chiudi ${label}`}
        closeAllLabel="Chiudi tutte"
        onOpen={onOpen ?? (() => undefined)}
        onClose={(id) => setItems((current) => current.filter((item) => item.id !== id))}
        onCloseAll={onCloseAll ?? (() => undefined)}
      />
    </I18nProvider>
  );
}

describe("AppSwitcher", () => {
  it("è un dialog con una riga per app, il focus sull'app corrente e Chiudi tutte", async () => {
    render(<Harness />);
    const dialog = await screen.findByRole("dialog", { name: "App aperte (3)" });
    const rows = within(dialog).getAllByRole("row");
    expect(rows.map((row) => row.textContent)).toEqual(["Progetti", "About", "CV"]);
    expect(rows[0]).toHaveFocus();
    expect(within(dialog).getByRole("button", { name: "Chiudi tutte" })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Chiudi CV" })).toBeInTheDocument();
  });

  it("un tocco sulla riga apre l'app; Invio anche", async () => {
    const onOpen = vi.fn<(id: string) => void>();
    const user = userEvent.setup();
    render(<Harness onOpen={onOpen} />);
    await user.click(await screen.findByRole("row", { name: "About" }));
    expect(onOpen).toHaveBeenLastCalledWith("about");
    screen.getByRole("row", { name: "CV" }).focus();
    await user.keyboard("{Enter}");
    expect(onOpen).toHaveBeenLastCalledWith("cv");
  });

  it("il pulsante di una riga la chiude e il focus passa alla riga successiva", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(await screen.findByRole("button", { name: "Chiudi Progetti" }));
    expect(screen.queryByRole("row", { name: "Progetti" })).toBeNull();
    expect(await screen.findByRole("row", { name: "About" })).toHaveFocus();
  });

  it("Canc chiude la riga con il focus; sull'ultima il focus va a quella che la precede", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const last = await screen.findByRole("row", { name: "CV" });
    last.focus();
    await user.keyboard("{Delete}");
    expect(screen.queryByRole("row", { name: "CV" })).toBeNull();
    expect(await screen.findByRole("row", { name: "About" })).toHaveFocus();
  });

  it("un altro tasto non chiude nulla; Chiudi tutte e Chiudi della barra chiamano le callback", async () => {
    const onCloseAll = vi.fn<() => void>();
    const onOpenChange = vi.fn<(isOpen: boolean) => void>();
    const user = userEvent.setup();
    render(<Harness onCloseAll={onCloseAll} onOpenChange={onOpenChange} />);
    (await screen.findByRole("row", { name: "About" })).focus();
    await user.keyboard("{Backspace}");
    expect(screen.getAllByRole("row")).toHaveLength(3);
    await user.click(screen.getByRole("button", { name: "Chiudi tutte" }));
    expect(onCloseAll).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole("button", { name: "Chiudi" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("non ha violazioni axe", async () => {
    render(<Harness />);
    await screen.findByRole("dialog");
    await expectNoAxeViolations(document.body);
  });
});
