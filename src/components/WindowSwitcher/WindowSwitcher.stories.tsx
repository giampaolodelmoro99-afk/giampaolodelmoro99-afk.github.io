import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { modalStage, overlaysInStoryRoot } from "../../../.storybook/decorators";
import { type SwitcherItem, WindowSwitcher } from "./WindowSwitcher";

const items: SwitcherItem[] = [
  { id: "about", label: "About", icon: "about" },
  { id: "projects", label: "Progetti", icon: "projects" },
  { id: "terminal", label: "Terminale", icon: "terminal" },
];

function Switcher() {
  const [selected, setSelected] = useState<string | null>("projects");
  return (
    <WindowSwitcher
      isOpen
      onOpenChange={() => {}}
      items={items}
      selectedId={selected}
      onSelectionChange={setSelected}
      onActivate={() => {}}
      hint="Alt+W avanza · Maiusc+Alt+W torna indietro · Invio attiva · Esc annulla"
    />
  );
}

const meta: Meta<typeof WindowSwitcher> = {
  title: "Componenti/WindowSwitcher",
  component: WindowSwitcher,
  decorators: [modalStage, overlaysInStoryRoot],
};

export default meta;

type Story = StoryObj<typeof WindowSwitcher>;

export const Aperto: Story = {
  tags: ["visual"],
  render: () => <Switcher />,
};
