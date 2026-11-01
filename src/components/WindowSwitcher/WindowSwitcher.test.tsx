import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { type SwitcherItem, WindowSwitcher } from "./WindowSwitcher";

const items: SwitcherItem[] = [
  { id: "about", label: "About", icon: "about" },
  { id: "projects", label: "Progetti", icon: "projects" },
  { id: "cv", label: "CV", icon: "cv" },
];

function Switcher(props: { onActivate?: (id: string) => void; onClose?: () => void }) {
  const [selected, setSelected] = useState<string | null>("projects");
  return (
    <I18nProvider locale="it-IT">
      <WindowSwitcher
        isOpen
        onOpenChange={(isOpen) => {
          if (!isOpen) props.onClose?.();
        }}
        items={items}
        selectedId={selected}
        onSelectionChange={setSelected}
        onActivate={props.onActivate ?? (() => {})}
        hint="Alt+W avanza"
      />
    </I18nProvider>
  );
}

describe("WindowSwitcher", () => {
  it("è un dialog modale con l'elenco delle finestre e il nome della scelta", async () => {
    render(<Switcher />);
    const dialog = await screen.findByRole("dialog", { name: "Finestre aperte" });
    const list = within(dialog).getByRole("listbox", { name: "Finestre aperte" });
    expect(within(list).getAllByRole("option")).toHaveLength(3);
    expect(within(list).getByRole("option", { name: "Progetti" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(dialog.querySelector("p[aria-hidden=true]")).toHaveTextContent("Progetti");
    expect(dialog.querySelector("[aria-live], output, [role=status]")).toBeNull();
    expect(within(dialog).getByText("Alt+W avanza")).toBeInTheDocument();
    await waitFor(() =>
      expect(within(list).getByRole("option", { name: "Progetti" })).toHaveFocus(),
    );
  });

  it("le frecce cambiano la scelta e Invio attiva la finestra", async () => {
    const onActivate = vi.fn<(id: string) => void>();
    const user = userEvent.setup();
    render(<Switcher onActivate={onActivate} />);
    await waitFor(() => expect(screen.getByRole("option", { name: "Progetti" })).toHaveFocus());
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("option", { name: "CV" })).toHaveFocus();
    expect(screen.getByRole("dialog").querySelector("p[aria-hidden=true]")).toHaveTextContent("CV");
    await user.keyboard("{Home}");
    expect(screen.getByRole("option", { name: "About" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onActivate).toHaveBeenCalledWith("about");
  });

  it("Esc chiude", async () => {
    const onClose = vi.fn<() => void>();
    const user = userEvent.setup();
    render(<Switcher onClose={onClose} />);
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("non ha violazioni axe", async () => {
    render(<Switcher />);
    await screen.findByRole("dialog");
    await expectNoAxeViolations(document.body);
  });
});
