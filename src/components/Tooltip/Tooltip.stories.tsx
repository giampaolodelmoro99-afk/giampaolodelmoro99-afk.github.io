import type { Meta, StoryObj } from "@storybook/react-vite";
import { overlaysInStoryRoot } from "../../../.storybook/decorators";
import { Button } from "../Button";
import { Tooltip } from "./Tooltip";
import styles from "./Tooltip.stories.module.css";

const meta: Meta<typeof Tooltip> = {
  title: "Componenti/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  args: { text: "Svuota il cestino" },
  decorators: [
    (Story) => (
      <div className={styles.stage}>
        <Story />
      </div>
    ),
    overlaysInStoryRoot,
  ],
  render: (args) => (
    <Tooltip {...args}>
      <Button icon="trash" aria-label="Svuota il cestino" />
    </Tooltip>
  ),
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {};

export const Aperto: Story = {
  tags: ["visual"],
  args: { defaultOpen: true },
};
