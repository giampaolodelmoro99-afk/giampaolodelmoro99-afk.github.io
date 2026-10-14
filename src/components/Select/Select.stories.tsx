import type { Meta, StoryObj } from "@storybook/react-vite";
import { overlaysInStoryRoot } from "../../../.storybook/decorators";
import { Select } from "./Select";
import storyStyles from "../TextField/TextField.stories.module.css";
import styles from "./Select.stories.module.css";

const options = [
  { id: "pixel", label: "Pixel" },
  { id: "readable", label: "Leggibile" },
  { id: "large", label: "Grande (non disponibile)", isDisabled: true },
  { id: "system", label: "Di sistema" },
];

const meta: Meta<typeof Select> = {
  title: "Componenti/Select",
  component: Select,
  tags: ["autodocs"],
  args: { label: "Carattere", options },
  decorators: [
    (Story) => (
      <div className={storyStyles.stack}>
        <Story />
      </div>
    ),
    overlaysInStoryRoot,
  ],
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const Stati: Story = {
  tags: ["visual"],
  render: () => (
    <>
      <Select label="Carattere" options={options} defaultSelectedKey="readable" />
      <Select label="Senza scelta" options={options} />
      <Select label="Disabilitato" options={options} defaultSelectedKey="pixel" isDisabled />
      <Select label="Non valido" options={options} isInvalid errorMessage="Scegli un carattere" />
    </>
  ),
};

export const Aperta: Story = {
  tags: ["visual"],
  args: { defaultSelectedKey: "readable", defaultOpen: true },
  decorators: [
    (Story) => (
      <div className={styles.stage}>
        <Story />
      </div>
    ),
  ],
};
