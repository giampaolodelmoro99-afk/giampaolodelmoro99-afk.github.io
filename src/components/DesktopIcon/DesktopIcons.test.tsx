import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Key } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { DesktopIcons } from "./DesktopIcons";

const items = [
  { id: "about", label: "Chi sono", icon: "about" as const },
  { id: "projects", label: "Progetti", icon: "projects" as const },
  { id: "cv", label: "Curriculum", icon: "cv" as const },
  { id: "trash", label: "Cestino", icon: "trash" as const, isDisabled: true },
];

function Icons(props: { onAction?: (id: Key) => void }) {
  return <DesktopIcons label="Desktop" items={items} {...props} />;
}

describe("DesktopIcons", () => {
  it("è una griglia con nome e una riga per icona", () => {
    render(<Icons />);
    expect(screen.getByRole("grid", { name: "Desktop" })).toBeInTheDocument();
    expect(screen.getAllByRole("row").map((row) => row.textContent)).toEqual([
      "Chi sono",
      "Progetti",
      "Curriculum",
      "Cestino",
    ]);
  });

  it("un clic seleziona, il doppio clic apre", async () => {
    const onAction = vi.fn<(id: Key) => void>();
    const user = userEvent.setup();
    render(<Icons onAction={onAction} />);
    const projects = screen.getByRole("row", { name: "Progetti" });
    await user.click(projects);
    expect(projects).toHaveAttribute("aria-selected", "true");
    expect(onAction).not.toHaveBeenCalled();
    await user.dblClick(projects);
    expect(onAction).toHaveBeenCalledWith("projects");
  });

  it("le frecce si muovono tra le icone e Invio apre", async () => {
    const onAction = vi.fn<(id: Key) => void>();
    const user = userEvent.setup();
    render(<Icons onAction={onAction} />);
    await user.tab();
    expect(screen.getByRole("row", { name: "Chi sono" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("row", { name: "Progetti" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onAction).toHaveBeenCalledWith("projects");
  });

  it("l'icona disabilitata non si apre", async () => {
    const onAction = vi.fn<(id: Key) => void>();
    render(<Icons onAction={onAction} />);
    const trash = screen.getByRole("row", { name: "Cestino" });
    expect(trash).toHaveAttribute("aria-disabled", "true");
    await userEvent.dblClick(trash);
    expect(onAction).not.toHaveBeenCalled();
  });

  it("non ha violazioni axe", async () => {
    const { container } = render(<Icons />);
    await expectNoAxeViolations(container);
  });
});
