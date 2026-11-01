import type { Meta, StoryObj } from "@storybook/react-vite";
import { ResizeHandles } from "./ResizeHandles";
import styles from "./ResizeHandles.stories.module.css";

const meta: Meta<typeof ResizeHandles> = {
  title: "Componenti/ResizeHandles",
  component: ResizeHandles,
  args: { onResizeStart: () => {} },
  decorators: [
    (Story) => (
      <div className={styles.stage}>
        <div className={styles.frame}>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ResizeHandles>;

export const Default: Story = {};

export const DuranteIlRidimensionamento: Story = {
  tags: ["visual"],
  args: { isResizing: true },
};
