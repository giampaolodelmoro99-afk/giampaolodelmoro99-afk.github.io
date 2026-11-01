import type { Meta, StoryObj } from "@storybook/react-vite";
import { focusWithKeyboard, hover, press } from "../../../.storybook/interactions";
import { Checkbox } from "./Checkbox";
import styles from "../TextField/TextField.stories.module.css";

const meta: Meta<typeof Checkbox> = {
  title: "Componenti/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: { children: "Mostra i secondi nell'orologio" },
  decorators: [
    (Story) => (
      <div className={styles.stack}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Stati: Story = {
  tags: ["visual"],
  render: () => (
    <>
      <Checkbox>Normale</Checkbox>
      <Checkbox defaultSelected>Selezionata</Checkbox>
      <Checkbox isIndeterminate>Seleziona tutto (in parte)</Checkbox>
      <Checkbox isDisabled>Disabilitata</Checkbox>
      <Checkbox isDisabled defaultSelected>
        Disabilitata e selezionata
      </Checkbox>
    </>
  ),
};

export const Hover: Story = {
  play: async ({ canvasElement }) => {
    await hover(canvasElement.querySelector("label") ?? canvasElement);
  },
};

export const Premuta: Story = {
  play: async ({ canvasElement }) => {
    await press(canvasElement.querySelector("label") ?? canvasElement);
  },
};

export const FocusAccantoADisabilitata: Story = {
  render: () => (
    <>
      <Checkbox isDisabled>Disabilitata</Checkbox>
      <Checkbox defaultSelected>Con focus</Checkbox>
    </>
  ),
  play: async ({ canvas }) => {
    const label = canvas.getByText("Con focus").closest("label");
    await focusWithKeyboard(label ?? canvas.getByText("Con focus"));
  },
};
