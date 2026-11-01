import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { RunDialog, type RunSuggestion } from "./RunDialog";

const suggestions: RunSuggestion[] = [
  { id: "projects", label: "Progetti" },
  { id: "cv", label: "CV" },
  { id: "contacts", label: "Contatti" },
  { id: "controlPanel", label: "Pannello di controllo" },
];

function Run(props: { onRun?: (command: string) => string | null; onClose?: () => void }) {
  return (
    <I18nProvider locale="it-IT">
      <RunDialog
        isOpen
        onOpenChange={(isOpen) => {
          if (!isOpen) props.onClose?.();
        }}
        suggestions={suggestions}
        onRun={props.onRun ?? (() => null)}
      />
    </I18nProvider>
  );
}

describe("RunDialog", () => {
  it("è un dialog con il campo Apri e il focus nel campo", async () => {
    render(<Run />);
    const dialog = await screen.findByRole("dialog", { name: "Esegui" });
    const field = within(dialog).getByRole("textbox", { name: "Apri" });
    await waitFor(() => expect(field).toHaveFocus());
    expect(within(dialog).getByRole("button", { name: "OK" })).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("scrivendo filtra i suggerimenti, anche senza accenti e maiuscole", async () => {
    const user = userEvent.setup();
    render(<Run />);
    await user.type(await screen.findByRole("textbox", { name: "Apri" }), "CON");
    const list = screen.getByRole("listbox", { name: "Suggerimenti" });
    expect(
      within(list)
        .getAllByRole("option")
        .map((option) => option.textContent),
    ).toEqual(["Contatti", "Pannello di controllo"]);
  });

  it("senza suggerimenti corrispondenti la lista non compare e axe resta pulito", async () => {
    const user = userEvent.setup();
    render(<Run />);
    await user.type(await screen.findByRole("textbox", { name: "Apri" }), "xyz");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(screen.queryByRole("option")).toBeNull();
    await expectNoAxeViolations(document.body);
  });

  it("Invio esegue il testo scritto e chiude se il comando esiste", async () => {
    const onRun = vi.fn<(command: string) => string | null>(() => null);
    const onClose = vi.fn<() => void>();
    const user = userEvent.setup();
    render(<Run onRun={onRun} onClose={onClose} />);
    await user.type(await screen.findByRole("textbox", { name: "Apri" }), "cv{Enter}");
    expect(onRun).toHaveBeenCalledWith("cv");
    expect(onClose).toHaveBeenCalled();
  });

  it("con le frecce si sceglie un suggerimento senza lasciare il campo", async () => {
    const onRun = vi.fn<(command: string) => string | null>(() => null);
    const user = userEvent.setup();
    render(<Run onRun={onRun} />);
    const field = await screen.findByRole("textbox", { name: "Apri" });
    await user.type(field, "pro{ArrowDown}");
    expect(field).toHaveFocus();
    expect(field.getAttribute("aria-activedescendant")).toBeTruthy();
    await user.keyboard("{Enter}");
    expect(onRun).toHaveBeenCalledWith("Progetti");
  });

  it("un comando sconosciuto mostra l'errore collegato al campo e non chiude", async () => {
    const onClose = vi.fn<() => void>();
    const user = userEvent.setup();
    render(<Run onRun={(command) => `Non trovo "${command}".`} onClose={onClose} />);
    const field = await screen.findByRole("textbox", { name: "Apri" });
    await user.type(field, "xyz");
    await user.click(screen.getByRole("button", { name: "OK" }));
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription(/Non trovo "xyz"/);
    expect(field).toHaveFocus();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("Invio con il campo vuoto non esegue nulla e non mostra errori", async () => {
    const onRun = vi.fn<(command: string) => string | null>(() => "errore");
    const user = userEvent.setup();
    render(<Run onRun={onRun} />);
    const field = await screen.findByRole("textbox", { name: "Apri" });
    await user.type(field, "   {Enter}");
    expect(onRun).not.toHaveBeenCalled();
    expect(field).not.toHaveAttribute("aria-invalid");
  });

  it("Annulla chiude", async () => {
    const onClose = vi.fn<() => void>();
    const user = userEvent.setup();
    render(<Run onClose={onClose} />);
    await user.click(await screen.findByRole("button", { name: "Annulla" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("non ha violazioni axe", async () => {
    const user = userEvent.setup();
    render(<Run />);
    await user.type(await screen.findByRole("textbox", { name: "Apri" }), "c");
    await expectNoAxeViolations(document.body);
  });
});
