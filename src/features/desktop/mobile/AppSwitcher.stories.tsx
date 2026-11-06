import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppSwitcher, type AppSwitcherItem } from "./AppSwitcher";

const items: AppSwitcherItem[] = [
  { id: "projects", label: "Progetti", icon: "projects" },
  { id: "about", label: "About", icon: "about" },
  { id: "terminal", label: "Terminale", icon: "terminal" },
  { id: "cv", label: "CV", icon: "cv" },
  { id: "contacts", label: "Contatti", icon: "contacts" },
];

const meta: Meta<typeof AppSwitcher> = {
  title: "Funzioni/AppSwitcher",
  component: AppSwitcher,
  parameters: { layout: "fullscreen" },
  args: {
    isOpen: true,
    onOpenChange: () => undefined,
    title: "App aperte (3)",
    items: items.slice(0, 3),
    currentId: "projects",
    closeLabel: (label) => `Chiudi ${label}`,
    closeAllLabel: "Chiudi tutte",
    onOpen: () => undefined,
    onClose: () => undefined,
    onCloseAll: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof AppSwitcher>;

export const TreApp: Story = { tags: ["visual"] };

export const UnaApp: Story = { args: { title: "App aperte (1)", items: items.slice(0, 1) } };

export const CinqueApp: Story = {
  args: { title: "App aperte (5)", items, currentId: "terminal" },
};
