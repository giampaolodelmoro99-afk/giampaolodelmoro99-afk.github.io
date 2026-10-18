import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { Window } from "./Window";

describe("Window", () => {
  it("è una sezione con il nome dalla barra del titolo", () => {
    render(
      <Window title="Progetti" icon="projects">
        <p>Contenuto</p>
      </Window>,
    );
    const region = screen.getByRole("region", { name: "Progetti" });
    expect(screen.getByRole("heading", { level: 2, name: "Progetti" })).toBeInTheDocument();
    expect(region).toHaveAttribute("data-active", "true");
    expect(region).toHaveTextContent("Contenuto");
  });

  it("i pulsanti hanno nomi accessibili nella lingua di React Aria e chiamano le callback", async () => {
    const onMinimize = vi.fn<() => void>();
    const onToggleMaximize = vi.fn<() => void>();
    const onClose = vi.fn<() => void>();
    const user = userEvent.setup();
    const { rerender } = render(
      <I18nProvider locale="it-IT">
        <Window
          title="Progetti"
          onMinimize={onMinimize}
          onToggleMaximize={onToggleMaximize}
          onClose={onClose}
        >
          <p>Contenuto</p>
        </Window>
      </I18nProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Riduci a icona" }));
    await user.click(screen.getByRole("button", { name: "Ingrandisci" }));
    await user.click(screen.getByRole("button", { name: "Chiudi" }));
    expect([onMinimize, onToggleMaximize, onClose].map((fn) => fn.mock.calls.length)).toEqual([
      1, 1, 1,
    ]);
    rerender(
      <I18nProvider locale="en-US">
        <Window title="Projects" isMaximized>
          <p>Content</p>
        </Window>
      </I18nProvider>,
    );
    expect(screen.getByRole("button", { name: "Restore" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Minimize" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("con controls mostra solo i pulsanti richiesti, in ordine", () => {
    render(
      <I18nProvider locale="it-IT">
        <Window title="Avviso" controls={["close"]}>
          <p>Testo</p>
        </Window>
      </I18nProvider>,
    );
    expect(
      screen.getAllByRole("button").map((button) => button.getAttribute("aria-label")),
    ).toEqual(["Chiudi"]);
  });

  it("segna inattiva, ingrandita e documento", () => {
    render(
      <Window title="Privacy" isActive={false} isMaximized variant="document">
        <p>Testo</p>
      </Window>,
    );
    const region = screen.getByRole("region", { name: "Privacy" });
    expect(region).toHaveAttribute("data-active", "false");
    expect(region).toHaveAttribute("data-maximized", "true");
    expect(region).toHaveAttribute("data-variant", "document");
  });

  it("include menu e barra di stato", () => {
    render(
      <Window title="Progetti" menu={<nav aria-label="Menu">menu</nav>} statusBar={<p>stato</p>}>
        <p>Contenuto</p>
      </Window>,
    );
    expect(screen.getByRole("navigation", { name: "Menu" })).toBeInTheDocument();
    expect(screen.getByText("stato")).toBeInTheDocument();
  });

  it("non ha violazioni axe", async () => {
    const { container } = render(
      <Window title="Progetti">
        <p>Contenuto</p>
      </Window>,
    );
    await expectNoAxeViolations(container);
  });
});
