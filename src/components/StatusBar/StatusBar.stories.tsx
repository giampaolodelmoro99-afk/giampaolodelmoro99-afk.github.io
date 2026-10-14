import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusBar } from "./StatusBar";
import styles from "../TextField/TextField.stories.module.css";

const meta: Meta<typeof StatusBar> = {
  title: "Componenti/StatusBar",
  component: StatusBar,
  tags: ["autodocs"],
  args: {
    label: "Barra di stato",
    fields: [
      { id: "items", text: "12 oggetti", grow: true },
      { id: "size", text: "3,4 MB" },
    ],
  },
  decorators: [
    (Story) => (
      <div className={styles.stack}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof StatusBar>;

export const Default: Story = {};

export const Stati: Story = {
  tags: ["visual"],
  render: () => (
    <>
      <StatusBar
        label="Barra di stato dei progetti"
        fields={[
          { id: "items", text: "12 oggetti", grow: true },
          { id: "size", text: "3,4 MB" },
        ]}
      />
      <StatusBar
        label="Barra di stato con testo troncato"
        fields={[
          {
            id: "path",
            text: "Case study: il portfolio in stile Windows 95, dalla prima versione alla seconda",
            grow: true,
          },
          { id: "line", text: "Riga 128, colonna 42" },
        ]}
      />
      <StatusBar label="Barra di stato a un campo" fields={[{ id: "ready", text: "Pronto" }]} />
    </>
  ),
};
