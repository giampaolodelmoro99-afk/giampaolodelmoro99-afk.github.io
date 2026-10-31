import type { Meta, StoryObj } from "@storybook/react-vite";
import { overlaysInStoryRoot } from "../../../.storybook/decorators";
import { focusWithKeyboard, hover } from "../../../.storybook/interactions";
import { MenuItem, MenuSeparator, Submenu } from "../MenuBar";
import { StartButton } from "./StartButton";
import styles from "./StartButton.stories.module.css";

function Start({ open = false }: { open?: boolean }) {
  return (
    <StartButton defaultOpen={open}>
      <MenuItem id="projects" icon="projects">
        Progetti
      </MenuItem>
      <MenuItem id="about" icon="about">
        Chi sono
      </MenuItem>
      <MenuItem id="cv" icon="cv">
        Curriculum
      </MenuItem>
      <Submenu label="Giochi" icon="minefield">
        <MenuItem id="minefield">Campo minato</MenuItem>
      </Submenu>
      <MenuSeparator />
      <MenuItem id="controlpanel" icon="controlpanel">
        Pannello di controllo
      </MenuItem>
      <MenuItem id="run" icon="run">
        Esegui…
      </MenuItem>
    </StartButton>
  );
}

const meta: Meta<typeof StartButton> = {
  title: "Componenti/StartButton",
  component: StartButton,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className={styles.stage}>
        <Story />
      </div>
    ),
    overlaysInStoryRoot,
  ],
  render: () => <Start />,
};

export default meta;

type Story = StoryObj<typeof StartButton>;

export const Default: Story = {
  tags: ["visual"],
};

export const Hover: Story = {
  play: async ({ canvas }) => {
    await hover(await canvas.findByRole("button", { name: "Start" }));
  },
};

export const Focus: Story = {
  play: async ({ canvas }) => {
    await focusWithKeyboard(await canvas.findByRole("button", { name: "Start" }));
  },
};

export const Aperto: Story = {
  tags: ["visual"],
  render: () => <Start open />,
};
