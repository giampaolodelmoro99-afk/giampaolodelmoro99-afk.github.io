import type { Meta, StoryObj } from "@storybook/react-vite";
import { type Key, useState } from "react";
import { focusWithKeyboard, hover } from "../../../.storybook/interactions";
import { DesktopIcons } from "./DesktopIcons";
import styles from "./DesktopIcons.stories.module.css";

const items = [
  { id: "about", label: "Chi sono", icon: "about" as const },
  { id: "projects", label: "Progetti", icon: "projects" as const },
  { id: "cv", label: "Curriculum", icon: "cv" as const },
  { id: "skills", label: "Competenze tecniche e strumenti", icon: "skills" as const },
  { id: "controlpanel", label: "Pannello di controllo", icon: "controlpanel" as const },
  { id: "trash", label: "Cestino", icon: "trash" as const, isDisabled: true },
];

const meta: Meta<typeof DesktopIcons> = {
  title: "Componenti/DesktopIcon",
  component: DesktopIcons,
  tags: ["autodocs"],
  args: { label: "Desktop", items },
  decorators: [
    (Story) => (
      <div className={styles.desktop}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof DesktopIcons>;

export const Default: Story = {
  tags: ["visual"],
};

export const Selezionata: Story = {
  tags: ["visual"],
  args: { defaultSelectedKeys: ["skills"] },
};

export const Hover: Story = {
  tags: ["visual"],
  play: async ({ canvas }) => {
    await hover(await canvas.findByRole("row", { name: "Progetti" }));
  },
};

export const Focus: Story = {
  tags: ["visual"],
  play: async ({ canvas }) => {
    await focusWithKeyboard(await canvas.findByRole("row", { name: "Chi sono" }));
  },
};

function WithOpening() {
  const [opened, setOpened] = useState<Key | null>(null);
  return (
    <>
      <DesktopIcons label="Desktop" items={items} onAction={setOpened} />
      <output className={styles.opened}>
        {opened === null ? "Nessuna finestra aperta" : `Aperta: ${String(opened)}`}
      </output>
    </>
  );
}

export const ConApertura: Story = {
  render: () => <WithOpening />,
};
