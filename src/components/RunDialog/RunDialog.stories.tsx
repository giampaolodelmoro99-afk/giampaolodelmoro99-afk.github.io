import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent } from "storybook/test";
import { overlaysInStoryRoot } from "../../../.storybook/decorators";
import { RunDialog } from "./RunDialog";

const meta: Meta<typeof RunDialog> = {
  title: "Componenti/RunDialog",
  component: RunDialog,
  decorators: [overlaysInStoryRoot],
  args: {
    isOpen: true,
    onOpenChange: () => {},
    suggestions: [
      { id: "projects", label: "Progetti" },
      { id: "cv", label: "CV" },
      { id: "contacts", label: "Contatti" },
      { id: "controlPanel", label: "Pannello di controllo" },
    ],
    onRun: (command: string) =>
      command === "xyz" ? 'Non trovo "xyz". Prova con progetti, cv o contatti.' : null,
  },
};

export default meta;

type Story = StoryObj<typeof RunDialog>;

export const Vuoto: Story = {};

export const Suggerimenti: Story = {
  tags: ["visual"],
  play: async ({ canvas }) => {
    await userEvent.type(await canvas.findByRole("textbox", { name: "Apri" }), "co");
  },
};

export const Errore: Story = {
  play: async ({ canvas }) => {
    await userEvent.type(await canvas.findByRole("textbox", { name: "Apri" }), "xyz{Enter}");
  },
};
