import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent } from "storybook/test";
import { overlaysInStoryRoot } from "../../../.storybook/decorators";
import { afterLayout, hover } from "../../../.storybook/interactions";
import { MenuItem, MenuSeparator, Submenu } from "./Menu";
import { ContextMenu } from "./ContextMenu";
import { MenuBar, MenuButton } from "./MenuBar";
import styles from "./MenuBar.stories.module.css";

function Bar({ openFile = false }: { openFile?: boolean }) {
  return (
    <MenuBar label="Menu della finestra">
      <MenuButton label="File" defaultOpen={openFile}>
        <MenuItem id="new" icon="makingof" shortcut="Ctrl+N">
          Nuovo
        </MenuItem>
        <MenuItem id="open" icon="projects" shortcut="Ctrl+O">
          Apri…
        </MenuItem>
        <MenuItem id="print" isDisabled>
          Stampa
        </MenuItem>
        <MenuSeparator />
        <Submenu label="Esporta">
          <MenuItem id="pdf">PDF</MenuItem>
          <MenuItem id="txt">Testo</MenuItem>
        </Submenu>
        <MenuSeparator />
        <MenuItem id="close">Chiudi</MenuItem>
      </MenuButton>
      <MenuButton label="Visualizza" selectionMode="single" defaultSelectedKeys={["icons"]}>
        <MenuItem id="icons">Icone grandi</MenuItem>
        <MenuItem id="list">Elenco</MenuItem>
      </MenuButton>
      <MenuButton label="Aiuto">
        <MenuItem id="about" icon="about">
          Informazioni
        </MenuItem>
      </MenuButton>
    </MenuBar>
  );
}

const meta: Meta<typeof MenuBar> = {
  title: "Componenti/MenuBar",
  component: MenuBar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className={styles.window}>
        <Story />
      </div>
    ),
    overlaysInStoryRoot,
  ],
  render: () => <Bar />,
};

export default meta;

type Story = StoryObj<typeof MenuBar>;

export const Default: Story = {
  tags: ["visual"],
};

export const HoverSuUnMenu: Story = {
  play: async ({ canvas }) => {
    await hover(await canvas.findByRole("button", { name: "Visualizza" }));
  },
};

export const Aperto: Story = {
  tags: ["visual"],
  render: () => <Bar openFile />,
};

export const ConSottomenu: Story = {
  render: () => <Bar openFile />,
  play: async ({ canvas }) => {
    const exportItem = await canvas.findByRole("menuitem", { name: "Esporta" });
    await afterLayout();
    await userEvent.click(exportItem);
    await canvas.findByRole("menuitem", { name: "PDF" });
  },
};

export const MenuContestuale: Story = {
  render: () => (
    <ContextMenu isOpen onOpenChange={() => {}} x={40} y={40} label="Desktop">
      <Submenu label="Disponi icone">
        <MenuItem id="name">Per nome</MenuItem>
        <MenuItem id="type">Per tipo</MenuItem>
      </Submenu>
      <MenuItem id="refresh">Aggiorna</MenuItem>
      <MenuSeparator />
      <MenuItem id="properties">Proprietà</MenuItem>
    </ContextMenu>
  ),
};
