import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "./ProgressBar";
import styles from "../TextField/TextField.stories.module.css";

const meta: Meta<typeof ProgressBar> = {
  title: "Componenti/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  args: { label: "Download", value: 40 },
  decorators: [
    (Story) => (
      <div className={styles.stack}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {};

export const Stati: Story = {
  tags: ["visual"],
  render: () => (
    <>
      <ProgressBar label="Vuota" value={0} />
      <ProgressBar label="Download" value={40} />
      <ProgressBar label="Copia" value={3} maxValue={7} valueLabel="3 file su 7" />
      <ProgressBar label="Completata" value={100} />
    </>
  ),
};

export const Indeterminata: Story = {
  args: { label: "Invio del messaggio", isIndeterminate: true },
};
