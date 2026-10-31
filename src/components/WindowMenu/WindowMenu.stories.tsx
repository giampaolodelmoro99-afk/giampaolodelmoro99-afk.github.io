import type { Meta, StoryObj } from "@storybook/react-vite";
import { overlaysInStoryRoot } from "../../../.storybook/decorators";
import { WindowMenu } from "./WindowMenu";
import styles from "./WindowMenu.stories.module.css";

const meta: Meta<typeof WindowMenu> = {
  title: "Componenti/WindowMenu",
  component: WindowMenu,
  args: { icon: "projects", onAction: () => {} },
  decorators: [
    (Story) => (
      <div className={styles.stage}>
        <div className={styles.titlebar}>
          <Story />
        </div>
      </div>
    ),
    overlaysInStoryRoot,
  ],
};

export default meta;

type Story = StoryObj<typeof WindowMenu>;

export const Default: Story = {};

export const Aperto: Story = {
  tags: ["visual"],
  args: { isOpen: true },
};

export const ApertoDaIngrandita: Story = {
  args: { isOpen: true, isMaximized: true },
};
