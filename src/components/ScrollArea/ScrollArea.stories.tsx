import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor } from "storybook/test";
import { afterLayout } from "../../../.storybook/interactions";
import { ScrollArea } from "./ScrollArea";
import storyStyles from "../TextField/TextField.stories.module.css";
import styles from "./ScrollArea.stories.module.css";

const paragraphs = [
  "Il portfolio nasce come un desktop in stile Windows 95: ogni sezione è una finestra.",
  "Le finestre si aprono dalle icone, dal menu Start o con un link diretto.",
  "Su telefono le finestre occupano tutto lo schermo e si passa dall'una all'altra dalla barra.",
  "Tutto funziona anche da tastiera, con il focus sempre visibile.",
  "Il tema ad alto contrasto e il carattere leggibile si scelgono dal Pannello di controllo.",
  "Le animazioni rispettano la preferenza di movimento ridotto del sistema.",
];

const meta: Meta<typeof ScrollArea> = {
  title: "Componenti/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className={storyStyles.stack}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <ScrollArea label="Come funziona il portfolio" className={styles.short}>
      {paragraphs.map((text) => (
        <p key={text} className={styles.prose}>
          {text}
        </p>
      ))}
    </ScrollArea>
  ),
};

export default meta;

type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  tags: ["visual"],
};

export const Focus: Story = {
  tags: ["visual"],
  play: async ({ canvas }) => {
    const region = canvas.getByRole("region", { name: "Come funziona il portfolio" });
    await afterLayout();
    await userEvent.tab();
    await waitFor(() => expect(region).toHaveFocus());
  },
};
