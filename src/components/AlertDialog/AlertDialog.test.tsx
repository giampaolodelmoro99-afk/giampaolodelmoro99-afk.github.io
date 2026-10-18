import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { Button } from "../Button";
import { AlertDialog } from "./AlertDialog";

function Example({ onPrimary }: { onPrimary?: () => void }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <I18nProvider locale="it-IT">
      <Button onPress={() => setOpen(true)}>Svuota il cestino</Button>
      <AlertDialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Cestino"
        kind="warning"
        message="Eliminare definitivamente tutti gli oggetti?"
        primaryLabel="Sì"
        secondaryLabel="No"
        {...(onPrimary ? { onPrimary } : {})}
      />
    </I18nProvider>
  );
}

async function open(user: ReturnType<typeof userEvent.setup>) {
  const trigger = screen.getByRole("button", { name: "Svuota il cestino" });
  await user.click(trigger);
  const dialog = await screen.findByRole("alertdialog", { name: "Cestino" });
  return { trigger, dialog };
}

describe("AlertDialog", () => {
  it("è un alertdialog con nome dal titolo, icona con nome e messaggio", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const { dialog } = await open(user);
    expect(dialog).toHaveTextContent("Eliminare definitivamente tutti gli oggetti?");
    expect(screen.getByRole("img", { name: "Avviso" })).toBeInTheDocument();
  });

  it("dà il focus al pulsante primario e lo tiene nel dialog", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await open(user);
    await waitFor(() => expect(screen.getByRole("button", { name: "Sì" })).toHaveFocus());
    await user.tab();
    await user.tab();
    await user.tab();
    expect(screen.getByRole("alertdialog")).toContainElement(
      document.activeElement instanceof HTMLElement ? document.activeElement : null,
    );
  });

  it("il primario chiama onPrimary, chiude e restituisce il focus", async () => {
    const onPrimary = vi.fn<() => void>();
    const user = userEvent.setup();
    render(<Example onPrimary={onPrimary} />);
    const { trigger } = await open(user);
    await user.click(screen.getByRole("button", { name: "Sì" }));
    expect(onPrimary).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("Esc chiude come il secondario, senza onPrimary", async () => {
    const onPrimary = vi.fn<() => void>();
    const user = userEvent.setup();
    render(<Example onPrimary={onPrimary} />);
    await open(user);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    expect(onPrimary).not.toHaveBeenCalled();
  });

  it("un clic fuori non chiude", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await open(user);
    await user.click(document.body);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
  });

  it("non ha violazioni axe da aperto", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const { dialog } = await open(user);
    await expectNoAxeViolations(dialog);
  });
});
