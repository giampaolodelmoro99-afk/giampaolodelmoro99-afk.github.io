import type { Meta, StoryObj } from "@storybook/react-vite";
import { MenuBar, MenuButton, MenuItem } from "../MenuBar";
import { StatusBar } from "../StatusBar";
import { Window } from "./Window";
import styles from "./Window.stories.module.css";

const meta: Meta<typeof Window> = {
  title: "Componenti/Window",
  component: Window,
  tags: ["autodocs"],
  args: { title: "Progetti", icon: "projects", children: <p>Contenuto della finestra.</p> },
  decorators: [
    (Story) => (
      <div className={styles.stage}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Window>;

export const Default: Story = {};

export const Stati: Story = {
  tags: ["visual"],
  render: () => (
    <>
      <Window title="Progetti" icon="projects" className={styles.small}>
        <p>Finestra attiva.</p>
      </Window>
      <Window title="Competenze" icon="skills" isActive={false} className={styles.small}>
        <p>Finestra inattiva.</p>
      </Window>
      <Window
        title="Pannello di controllo"
        icon="controlpanel"
        isMaximized
        className={styles.small}
      >
        <p>Finestra ingrandita: il pulsante centrale ripristina.</p>
      </Window>
      <Window title="Avviso" controls={["close"]} className={styles.small}>
        <p>Solo il pulsante Chiudi.</p>
      </Window>
      <Window
        title="Un titolo molto lungo che deve troncarsi con l'ellissi nella barra"
        icon="about"
        className={styles.small}
      >
        <p>Titolo troncato.</p>
      </Window>
    </>
  ),
};

export const Documento: Story = {
  tags: ["visual"],
  render: () => (
    <Window title="Chi sono" icon="about" variant="document">
      <h2>Gianpaolo Del Moro</h2>
      <p>
        Full Stack Developer in formazione. Questo è un esempio di finestra documento: il testo usa
        un carattere leggibile e righe di lunghezza limitata.
      </p>
      <h3>Percorso</h3>
      <p>
        Un paragrafo con un testo abbastanza lungo da andare a capo più volte nella colonna del
        documento, che resta entro la misura di lettura.
      </p>
    </Window>
  ),
};

export const ConMenuEStatusBar: Story = {
  tags: ["visual"],
  render: () => (
    <Window
      title="Progetti"
      icon="projects"
      menu={
        <MenuBar label="Menu di Progetti">
          <MenuButton label="File">
            <MenuItem id="close">Chiudi</MenuItem>
          </MenuButton>
          <MenuButton label="Visualizza">
            <MenuItem id="icons">Icone grandi</MenuItem>
          </MenuButton>
        </MenuBar>
      }
      statusBar={
        <StatusBar
          label="Barra di stato di Progetti"
          fields={[
            { id: "items", text: "12 oggetti", grow: true },
            { id: "size", text: "3,4 MB" },
          ]}
        />
      }
    >
      <p>Contenuto della finestra.</p>
    </Window>
  ),
};
