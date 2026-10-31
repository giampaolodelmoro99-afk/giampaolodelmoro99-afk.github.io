import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoveControls } from "./MoveControls";

const meta: Meta<typeof MoveControls> = {
  title: "Componenti/MoveControls",
  component: MoveControls,
  args: { onStep: () => {}, onConfirm: () => {}, onCancel: () => {} },
};

export default meta;

type Story = StoryObj<typeof MoveControls>;

export const Default: Story = {
  tags: ["visual"],
};
