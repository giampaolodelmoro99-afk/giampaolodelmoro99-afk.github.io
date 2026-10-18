import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { Taskbar } from "./Taskbar";
import { TaskbarButton } from "./TaskbarButton";

function Bar(props: { onChange?: (isSelected: boolean) => void }) {
  return (
    <Taskbar label="Finestre aperte" tray={<span>14:32</span>}>
      <TaskbarButton icon="projects" defaultSelected {...props}>
        Progetti
      </TaskbarButton>
      <TaskbarButton icon="about">Chi sono</TaskbarButton>
    </Taskbar>
  );
}

describe("Taskbar e TaskbarButton", () => {
  it("è una toolbar con nome; i pulsanti espongono aria-pressed", () => {
    render(<Bar />);
    expect(screen.getByRole("toolbar", { name: "Finestre aperte" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Progetti" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Chi sono" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByText("14:32")).toBeInTheDocument();
  });

  it("le frecce si muovono tra i pulsanti e il clic cambia lo stato", async () => {
    const onChange = vi.fn<(isSelected: boolean) => void>();
    const user = userEvent.setup();
    render(<Bar onChange={onChange} />);
    await user.tab();
    expect(screen.getByRole("button", { name: "Progetti" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Chi sono" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Progetti" }));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("non ha violazioni axe", async () => {
    const { container } = render(<Bar />);
    await expectNoAxeViolations(container);
  });
});
