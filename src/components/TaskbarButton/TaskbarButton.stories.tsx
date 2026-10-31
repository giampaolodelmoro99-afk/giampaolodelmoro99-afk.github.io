import type { Meta, StoryObj } from "@storybook/react-vite";
import { focusWithKeyboard, hover, press } from "../../../.storybook/interactions";
import { Taskbar } from "./Taskbar";
import { TaskbarButton } from "./TaskbarButton";

function Bar() {
  return (
    <Taskbar label="Finestre aperte" tray={<span>14:32</span>}>
      <TaskbarButton icon="projects" defaultSelected>
        Progetti
      </TaskbarButton>
      <TaskbarButton icon="about">Chi sono</TaskbarButton>
      <TaskbarButton icon="cv">Curriculum vitae e percorso di formazione</TaskbarButton>
      <TaskbarButton icon="trash" isDisabled>
        Cestino
      </TaskbarButton>
    </Taskbar>
  );
}

const meta: Meta<typeof Taskbar> = {
  title: "Componenti/Taskbar",
  component: Taskbar,
  tags: ["autodocs"],
  render: () => <Bar />,
};

export default meta;

type Story = StoryObj<typeof Taskbar>;

export const Default: Story = {
  tags: ["visual"],
};

export const Hover: Story = {
  play: async ({ canvas }) => {
    await hover(await canvas.findByRole("button", { name: "Chi sono" }));
  },
};

export const Premuto: Story = {
  play: async ({ canvas }) => {
    await press(await canvas.findByRole("button", { name: "Chi sono" }));
  },
};

export const Focus: Story = {
  tags: ["visual"],
  play: async ({ canvas }) => {
    await focusWithKeyboard(await canvas.findByRole("button", { name: "Progetti" }));
  },
};
