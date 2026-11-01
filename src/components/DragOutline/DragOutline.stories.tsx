import type { Meta, StoryObj } from "@storybook/react-vite";
import { DragOutline } from "./DragOutline";
import styles from "./DragOutline.stories.module.css";

const meta: Meta<typeof DragOutline> = {
  title: "Componenti/DragOutline",
  component: DragOutline,
  decorators: [
    (Story) => (
      <div className={styles.stage}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof DragOutline>;

export const Default: Story = {
  tags: ["visual"],
  args: { rect: { x: 24, y: 24, width: 280, height: 160 } },
};
