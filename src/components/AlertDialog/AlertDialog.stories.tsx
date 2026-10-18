import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { overlaysInStoryRoot } from "../../../.storybook/decorators";
import { Button } from "../Button";
import { AlertDialog, AlertDialogFrame } from "./AlertDialog";
import styles from "./AlertDialog.stories.module.css";

const meta: Meta<typeof AlertDialogFrame> = {
  title: "Componenti/AlertDialog",
  component: AlertDialogFrame,
  tags: ["autodocs"],
  args: {
    title: "Cestino",
    kind: "warning",
    message: "Eliminare definitivamente tutti gli oggetti nel cestino?",
    primaryLabel: "Sì",
    secondaryLabel: "No",
  },
  decorators: [
    (Story) => (
      <div className={styles.stage}>
        <Story />
      </div>
    ),
    overlaysInStoryRoot,
  ],
};

export default meta;

type Story = StoryObj<typeof AlertDialogFrame>;

export const Avviso: Story = {
  tags: ["visual"],
};

export const Errore: Story = {
  tags: ["visual"],
  args: {
    title: "Invio non riuscito",
    kind: "error",
    message: "Il messaggio non è partito. Controlla la connessione e riprova.",
    primaryLabel: "Riprova",
    secondaryLabel: "Annulla",
  },
};

export const UnPulsante: Story = {
  tags: ["visual"],
  args: {
    title: "Informazioni",
    kind: "info",
    message: "Il portfolio è in costruzione: alcune finestre arriveranno presto.",
    primaryLabel: "OK",
    secondaryLabel: undefined,
  },
};

function Interactive() {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Svuota il cestino</Button>
      <AlertDialog
        isOpen={isOpen}
        onOpenChange={setOpen}
        title="Cestino"
        kind="warning"
        message="Eliminare definitivamente tutti gli oggetti nel cestino?"
        primaryLabel="Sì"
        secondaryLabel="No"
      />
    </>
  );
}

export const Interattivo: Story = {
  render: () => <Interactive />,
};
