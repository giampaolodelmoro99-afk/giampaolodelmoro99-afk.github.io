import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { afterLayout } from "../../../.storybook/interactions";
import { Button } from "../Button";
import { TextArea } from "../TextArea";
import { TextField } from "./TextField";
import styles from "./TextField.stories.module.css";

const meta: Meta<typeof TextField> = {
  title: "Componenti/TextField",
  component: TextField,
  tags: ["autodocs"],
  args: { label: "Nome" },
  decorators: [
    (Story) => (
      <div className={styles.stack}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {};

export const Stati: Story = {
  tags: ["visual"],
  render: () => (
    <>
      <TextField label="Nome" description="Come vuoi essere chiamato" defaultValue="Ada" />
      <TextField
        label="Email"
        defaultValue="ada@"
        isInvalid
        errorMessage="Manca il dominio, per esempio nome@dominio.it"
      />
      <TextField label="Disabilitato" defaultValue="Non modificabile" isDisabled />
      <TextField label="Sola lettura" defaultValue="Si può copiare" isReadOnly />
    </>
  ),
};

export const Focus: Story = {
  tags: ["visual"],
  args: { defaultValue: "Ada" },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Nome" });
    await afterLayout();
    await userEvent.click(input);
    await waitFor(() => expect(input).toHaveAttribute("data-focused", "true"));
  },
};

export const EsempioForm: Story = {
  tags: ["visual"],
  render: () => (
    <form
      className={styles.form}
      aria-label="Esempio di form"
      onSubmit={(event) => event.preventDefault()}
    >
      <TextField label="Nome" name="name" autoComplete="name" isRequired />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        isRequired
        description="Ti rispondo a questo indirizzo"
      />
      <TextArea label="Messaggio" name="message" isRequired />
      <div className={styles.actions}>
        <Button type="submit" variant="default">
          Invia
        </Button>
      </div>
    </form>
  ),
};
