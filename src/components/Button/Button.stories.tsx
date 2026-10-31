import type { Meta, StoryObj } from "@storybook/react-vite";
import { focusWithKeyboard, hover, press } from "../../../.storybook/interactions";
import { Button } from "./Button";
import styles from "./Button.stories.module.css";

const meta: Meta<typeof Button> = {
  title: "Componenti/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "OK" },
  decorators: [
    (Story) => (
      <div className={styles.row}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: { control: "inline-radio", options: ["normal", "default"] },
    isDisabled: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Stati: Story = {
  tags: ["visual"],
  render: () => (
    <>
      <Button>OK</Button>
      <Button variant="default">Salva</Button>
      <Button icon="run">Esegui</Button>
      <Button icon="trash" aria-label="Svuota il cestino" />
      <Button isDisabled>Annulla</Button>
      <Button variant="default" isDisabled>
        Invia
      </Button>
      <Button icon="run" isDisabled>
        Esegui
      </Button>
    </>
  ),
};

export const SoloIcona: Story = {
  render: () => <Button icon="trash" aria-label="Svuota il cestino" />,
};

export const Hover: Story = {
  play: async ({ canvas }) => {
    await hover(canvas.getByRole("button", { name: "OK" }));
  },
};

export const Premuto: Story = {
  play: async ({ canvas }) => {
    await press(canvas.getByRole("button", { name: "OK" }));
  },
};

export const PredefinitoPremuto: Story = {
  args: { variant: "default", children: "Salva" },
  play: async ({ canvas }) => {
    await press(canvas.getByRole("button", { name: "Salva" }));
  },
};

export const FocusAccantoADisabilitato: Story = {
  tags: ["visual"],
  render: () => (
    <>
      <Button isDisabled>Annulla</Button>
      <Button>OK</Button>
      <Button variant="default" isDisabled>
        Invia
      </Button>
    </>
  ),
  play: async ({ canvas }) => {
    await focusWithKeyboard(canvas.getByRole("button", { name: "OK" }));
  },
};
