import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextArea } from "./TextArea";
import styles from "../TextField/TextField.stories.module.css";

const longText = [
  "Ciao Gianpaolo,",
  "ho visto il portfolio e mi piacerebbe parlarti di un progetto.",
  "Si tratta di un'applicazione web per la gestione degli eventi,",
  "con un'interfaccia accessibile e veloce anche su telefono.",
  "Avresti tempo per una chiamata la prossima settimana?",
  "Grazie e a presto.",
].join("\n");

const meta: Meta<typeof TextArea> = {
  title: "Componenti/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  args: { label: "Messaggio" },
  decorators: [
    (Story) => (
      <div className={styles.stack}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TextArea>;

export const Default: Story = {};

export const Stati: Story = {
  tags: ["visual"],
  render: () => (
    <>
      <TextArea label="Messaggio" description="Scrivi pure su più righe" />
      <TextArea label="Messaggio lungo" rows={3} defaultValue={longText} />
      <TextArea label="Messaggio obbligatorio" isInvalid errorMessage="Scrivi almeno una frase" />
      <TextArea label="Disabilitata" rows={2} defaultValue="Non modificabile" isDisabled />
    </>
  ),
};
