import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Key } from "react";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { Select } from "./Select";

const options = [
  { id: "pixel", label: "Pixel" },
  { id: "readable", label: "Leggibile" },
  { id: "large", label: "Grande", isDisabled: true },
];

function Font(props: { onSelectionChange?: (key: Key | null) => void }) {
  return (
    <I18nProvider locale="it-IT">
      <Select label="Carattere" options={options} {...props} />
    </I18nProvider>
  );
}

describe("Select", () => {
  it("ha un pulsante con il nome dall'etichetta e il segnaposto di React Aria in italiano", () => {
    render(<Font />);
    const button = screen.getByRole("button", { name: /Carattere/ });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveTextContent("Seleziona un elemento");
  });

  it("si apre con Invio, le frecce scelgono, Invio conferma e la lista si chiude", async () => {
    const onSelectionChange = vi.fn<(key: Key | null) => void>();
    const user = userEvent.setup();
    render(<Font onSelectionChange={onSelectionChange} />);
    const button = screen.getByRole("button", { name: /Carattere/ });
    await user.tab();
    await user.keyboard("{Enter}");
    const listbox = await screen.findByRole("listbox");
    expect(button).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    await waitFor(() => expect(listbox).not.toBeInTheDocument());
    expect(onSelectionChange).toHaveBeenLastCalledWith("readable");
    expect(screen.getByRole("button", { name: /Carattere/ })).toHaveTextContent("Leggibile");
  });

  it("Esc chiude senza cambiare la scelta", async () => {
    const user = userEvent.setup();
    render(<Font />);
    await user.click(screen.getByRole("button", { name: /Carattere/ }));
    await screen.findByRole("listbox");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
    expect(screen.getByRole("button", { name: /Carattere/ })).toHaveTextContent(
      "Seleziona un elemento",
    );
  });

  it("le opzioni disabilitate non si scelgono", async () => {
    render(<Font />);
    await userEvent.click(screen.getByRole("button", { name: /Carattere/ }));
    const listbox = await screen.findByRole("listbox");
    expect(within(listbox).getByRole("option", { name: "Grande" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("collega l'errore", () => {
    render(
      <Select label="Carattere" options={options} isInvalid errorMessage="Scegli un carattere" />,
    );
    expect(screen.getByRole("button", { name: /Carattere/ })).toHaveAccessibleDescription(
      "Scegli un carattere",
    );
  });

  it("non ha violazioni axe, chiuso e aperto", async () => {
    const { container } = render(<Font />);
    await expectNoAxeViolations(container);
    await userEvent.click(screen.getByRole("button", { name: /Carattere/ }));
    await expectNoAxeViolations(await screen.findByRole("listbox"));
  });
});
