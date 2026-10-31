import type { Meta, StoryObj } from "@storybook/react-vite";
import { focusWithKeyboard, hover, press } from "../../../.storybook/interactions";
import { Radio, RadioGroup } from "./Radio";
import styles from "../TextField/TextField.stories.module.css";

const meta: Meta<typeof RadioGroup> = {
  title: "Componenti/Radio",
  component: RadioGroup,
  tags: ["autodocs"],
  args: { label: "Tema", defaultValue: "classic" },
  decorators: [
    (Story) => (
      <div className={styles.stack}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="classic">Classico</Radio>
      <Radio value="high-contrast">Alto contrasto</Radio>
      <Radio value="auto" isDisabled>
        Di sistema (disabilitato)
      </Radio>
    </RadioGroup>
  ),
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {};

export const Stati: Story = {
  tags: ["visual"],
  render: () => (
    <>
      <RadioGroup label="Tema" defaultValue="classic">
        <Radio value="classic">Classico</Radio>
        <Radio value="high-contrast">Alto contrasto</Radio>
        <Radio value="auto" isDisabled>
          Di sistema (disabilitato)
        </Radio>
      </RadioGroup>
      <RadioGroup label="Lingua" orientation="horizontal" defaultValue="it">
        <Radio value="it">Italiano</Radio>
        <Radio value="en">English</Radio>
      </RadioGroup>
      <RadioGroup label="Gruppo disabilitato" defaultValue="a" isDisabled>
        <Radio value="a">Prima</Radio>
        <Radio value="b">Seconda</Radio>
      </RadioGroup>
      <RadioGroup label="Gruppo non valido" isInvalid errorMessage="Scegli un'opzione">
        <Radio value="a">Prima</Radio>
        <Radio value="b">Seconda</Radio>
      </RadioGroup>
    </>
  ),
};

export const Hover: Story = {
  play: async ({ canvas }) => {
    await hover(
      canvas.getByText("Alto contrasto").closest("label") ?? canvas.getByText("Alto contrasto"),
    );
  },
};

export const Premuto: Story = {
  play: async ({ canvas }) => {
    await press(
      canvas.getByText("Alto contrasto").closest("label") ?? canvas.getByText("Alto contrasto"),
    );
  },
};

export const Focus: Story = {
  tags: ["visual"],
  play: async ({ canvas }) => {
    await focusWithKeyboard(
      canvas.getByText("Classico").closest("label") ?? canvas.getByText("Classico"),
    );
  },
};
