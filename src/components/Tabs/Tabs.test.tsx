import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Key } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { Tabs } from "./Tabs";

const tabs = [
  { id: "general", label: "Generale", content: "Impostazioni generali" },
  { id: "screen", label: "Schermo", content: "Tema e carattere" },
  { id: "sound", label: "Suoni", content: "Volume", isDisabled: true },
  { id: "about", label: "Informazioni", content: "Versione del sito" },
];

describe("Tabs", () => {
  it("ha una lista con nome, la prima scheda selezionata e il pannello collegato", () => {
    render(<Tabs label="Pannello di controllo" tabs={tabs} />);
    expect(screen.getByRole("tablist", { name: "Pannello di controllo" })).toBeInTheDocument();
    const general = screen.getByRole("tab", { name: "Generale" });
    expect(general).toHaveAttribute("aria-selected", "true");
    const panel = screen.getByRole("tabpanel", { name: "Generale" });
    expect(panel).toHaveTextContent("Impostazioni generali");
    expect(general).toHaveAttribute("aria-controls", panel.id);
  });

  it("le frecce cambiano scheda e saltano quelle disabilitate", async () => {
    const onSelectionChange = vi.fn<(key: Key) => void>();
    const user = userEvent.setup();
    render(<Tabs label="Pannello" tabs={tabs} onSelectionChange={onSelectionChange} />);
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Schermo" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Tema e carattere");
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Informazioni" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Suoni" })).toHaveAttribute("aria-disabled", "true");
    expect(onSelectionChange.mock.calls.map(([key]) => key)).toEqual([
      "general",
      "screen",
      "about",
    ]);
  });

  it("si cambia scheda con un clic", async () => {
    render(<Tabs label="Pannello" tabs={tabs} />);
    await userEvent.click(screen.getByRole("tab", { name: "Informazioni" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Versione del sito");
  });

  it("non ha violazioni axe", async () => {
    const { container } = render(<Tabs label="Pannello" tabs={tabs} />);
    await expectNoAxeViolations(container);
  });
});
