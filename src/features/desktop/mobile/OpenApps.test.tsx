import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { renderAt } from "../../../../tests/setup/render";
import { createDesktopStore, emptyState, open } from "../../../stores/desktop";
import { OpenApps } from "./OpenApps";

function setup() {
  const store = createDesktopStore(open(open(open(emptyState, "about"), "cv"), "projects"));
  const handlers = {
    onOpen: vi.fn<(id: string) => void>(),
    onDismiss: vi.fn<() => void>(),
    onClosed: vi.fn<(id: string) => void>(),
    onAllClosed: vi.fn<() => void>(),
  };
  renderAt("/", () => (
    <I18nProvider locale="it-IT">
      <OpenApps store={store} {...handlers} />
    </I18nProvider>
  ));
  return { store, ...handlers };
}

describe("OpenApps", () => {
  it("elenca le app dallo store per ultimo uso, con il conteggio nel titolo", async () => {
    setup();
    expect(await screen.findByRole("dialog", { name: "App aperte (3)" })).toBeInTheDocument();
    expect(screen.getAllByRole("row").map((row) => row.textContent)).toEqual([
      "Progetti",
      "CV",
      "About",
    ]);
  });

  it("aprire una riga chiama onOpen con l'id dell'app", async () => {
    const { onOpen } = setup();
    await userEvent.setup().click(await screen.findByRole("row", { name: "CV" }));
    expect(onOpen).toHaveBeenCalledWith("cv");
  });

  it("chiudere una riga la toglie dallo store e lo comunica; l'ultima chiude il pannello", async () => {
    const user = userEvent.setup();
    const { store, onClosed, onDismiss } = setup();
    await user.click(await screen.findByRole("button", { name: "Chiudi CV" }));
    expect(store.getState().windows.cv).toBeUndefined();
    expect(onClosed).toHaveBeenCalledWith("cv");
    expect(onDismiss).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Chiudi About" }));
    await user.click(screen.getByRole("button", { name: "Chiudi Progetti" }));
    expect(store.getState().recent).toEqual([]);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("Chiudi tutte svuota lo store e chiude il pannello", async () => {
    const user = userEvent.setup();
    const { store, onAllClosed, onDismiss } = setup();
    await user.click(await screen.findByRole("button", { name: "Chiudi tutte" }));
    expect(Object.keys(store.getState().windows)).toEqual([]);
    expect(onAllClosed).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("il pulsante Chiudi della barra chiude il pannello senza toccare le app", async () => {
    const user = userEvent.setup();
    const { store, onDismiss } = setup();
    await user.click(await screen.findByRole("button", { name: "Chiudi" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(Object.keys(store.getState().windows)).toHaveLength(3);
  });
});
