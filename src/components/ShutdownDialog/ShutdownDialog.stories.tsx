import type { Meta, StoryObj } from "@storybook/react-vite";
import { overlaysInStoryRoot } from "../../../.storybook/decorators";
import { ShutdownDialog } from "./ShutdownDialog";

const meta: Meta<typeof ShutdownDialog> = {
  title: "Componenti/ShutdownDialog",
  component: ShutdownDialog,
  decorators: [overlaysInStoryRoot],
  args: { isOpen: true, onOpenChange: () => {}, onConfirm: () => {} },
};

export default meta;

type Story = StoryObj<typeof ShutdownDialog>;

export const Aperto: Story = {
  tags: ["visual"],
};
