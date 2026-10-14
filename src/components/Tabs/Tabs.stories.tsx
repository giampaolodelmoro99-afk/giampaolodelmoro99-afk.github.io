import type { Meta, StoryObj } from "@storybook/react-vite";
import { focusWithKeyboard, hover } from "../../../.storybook/interactions";
import { Tabs } from "./Tabs";
import storyStyles from "../TextField/TextField.stories.module.css";
import styles from "./Tabs.stories.module.css";

const tabs = [
  { id: "general", label: "Generale", content: "Impostazioni generali del desktop." },
  { id: "screen", label: "Schermo", content: "Tema, carattere e dimensione del testo." },
  { id: "sound", label: "Suoni", content: "Volume.", isDisabled: true },
  { id: "about", label: "Informazioni", content: "Versione del sito." },
];

const meta: Meta<typeof Tabs> = {
  title: "Componenti/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: { label: "Pannello di controllo", tabs },
  decorators: [
    (Story) => (
      <div className={storyStyles.stack}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  tags: ["visual"],
};

export const Hover: Story = {
  tags: ["visual"],
  play: async ({ canvas }) => {
    await hover(await canvas.findByRole("tab", { name: "Schermo" }));
  },
};

export const Focus: Story = {
  tags: ["visual"],
  play: async ({ canvas }) => {
    await focusWithKeyboard(await canvas.findByRole("tab", { name: "Generale" }));
  },
};

export const Stretta: Story = {
  tags: ["visual"],
  args: { className: styles.narrow },
};
