import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { expectNoAxeViolations } from "../../../tests/setup/axe";
import { Taskbar } from "./Taskbar";
import { TaskbarButton } from "./TaskbarButton";
import { TaskbarIconButton } from "./TaskbarIconButton";

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

describe("TaskbarIconButton", () => {
  it("resta raggiungibile da non disponibile, con aria-disabled e nessuna azione", async () => {
    const onPress = vi.fn<() => void>();
    const user = userEvent.setup();
    render(
      <TaskbarIconButton
        icon="windows"
        aria-label="Finestre aperte: nessuna"
        isUnavailable
        onPress={onPress}
      />,
    );
    const button = screen.getByRole("button", { name: "Finestre aperte: nessuna" });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled();
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("apre il selettore e ne segnala lo stato", async () => {
    const onPress = vi.fn<() => void>();
    const user = userEvent.setup();
    const { rerender } = render(
      <TaskbarIconButton icon="windows" aria-label="Finestre aperte (Alt+W)" onPress={onPress} />,
    );
    const button = screen.getByRole("button", { name: "Finestre aperte (Alt+W)" });
    expect(button).toHaveAttribute("aria-haspopup", "dialog");
    expect(button).toHaveAttribute("aria-expanded", "false");
    await user.click(button);
    expect(onPress).toHaveBeenCalledTimes(1);
    rerender(
      <TaskbarIconButton
        icon="windows"
        aria-label="Finestre aperte (Alt+W)"
        isPressed
        onPress={onPress}
      />,
    );
    expect(button).toHaveAttribute("aria-expanded", "true");
  });
});
