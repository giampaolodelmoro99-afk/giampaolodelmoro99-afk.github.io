import type { Meta, StoryObj } from "@storybook/react-vite";
import { modalStage, overlaysInStoryRoot } from "../../../.storybook/decorators";
import { ShutdownDialog } from "./ShutdownDialog";

const meta: Meta<typeof ShutdownDialog> = {
  title: "Componenti/ShutdownDialog",
  component: ShutdownDialog,
  decorators: [modalStage, overlaysInStoryRoot],
  args: { isOpen: true, onOpenChange: () => {}, onConfirm: () => {} },
};

export default meta;

type Story = StoryObj<typeof ShutdownDialog>;

export const Aperto: Story = {
  tags: ["visual"],
};
