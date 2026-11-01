import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { type ShutdownChoice, ShutdownDialog } from "./ShutdownDialog";

function Shutdown(props: { onConfirm?: (choice: ShutdownChoice) => void; onClose?: () => void }) {
  return (
    <I18nProvider locale="it-IT">
      <ShutdownDialog
        isOpen
        onOpenChange={(isOpen) => {
          if (!isOpen) props.onClose?.();
        }}
        onConfirm={props.onConfirm ?? (() => {})}
      />
    </I18nProvider>
  );
}

describe("ShutdownDialog", () => {
  it("è un dialog modale con tre scelte e il focus su Spegni", async () => {
    render(<Shutdown />);
    const dialog = await screen.findByRole("dialog", { name: "Spegni" });
    const group = within(dialog).getByRole("radiogroup", { name: "Cosa vuoi fare?" });
    expect(
      within(group)
        .getAllByRole("radio")
        .map((radio) => radio.closest("label")?.textContent),
    ).toEqual(["Spegni", "Riavvia", "Passa alla Vista semplice"]);
    await waitFor(() => expect(within(group).getByRole("radio", { name: "Spegni" })).toHaveFocus());
  });

  it("le frecce cambiano scelta e Invio conferma", async () => {
    const onConfirm = vi.fn<(choice: ShutdownChoice) => void>();
    const user = userEvent.setup();
    render(<Shutdown onConfirm={onConfirm} />);
    await waitFor(() => expect(screen.getByRole("radio", { name: "Spegni" })).toHaveFocus());
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onConfirm).toHaveBeenCalledWith("restart");
  });

  it("OK conferma la scelta predefinita, Annulla chiude", async () => {
    const onConfirm = vi.fn<(choice: ShutdownChoice) => void>();
    const onClose = vi.fn<() => void>();
    const user = userEvent.setup();
    render(<Shutdown onConfirm={onConfirm} onClose={onClose} />);
    await user.click(await screen.findByRole("button", { name: "OK" }));
    expect(onConfirm).toHaveBeenCalledWith("shutdown");
    await user.click(screen.getByRole("button", { name: "Annulla" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("non ha violazioni axe", async () => {
    render(<Shutdown />);
    await screen.findByRole("dialog");
    await expectNoAxeViolations(document.body);
  });
});
