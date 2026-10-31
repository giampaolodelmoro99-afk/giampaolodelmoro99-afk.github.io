import type { Meta, StoryObj } from "@storybook/react-vite";
import { FarewellScreen } from "./FarewellScreen";

const meta: Meta<typeof FarewellScreen> = {
  title: "Componenti/FarewellScreen",
  component: FarewellScreen,
  args: {
    heading: "Puoi chiudere questa scheda.",
    message:
      "Il desktop è spento. Grazie della visita: se cambi idea, riaccendilo e ricomincia da dove vuoi.",
    restartLabel: "Riaccendi",
    footer: "gianpaolodelmoro.it",
    onRestart: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof FarewellScreen>;

export const Default: Story = {
  tags: ["visual"],
};
