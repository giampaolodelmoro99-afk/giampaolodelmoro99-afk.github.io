import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "../Checkbox";
import { Radio, RadioGroup } from "../Radio";
import { GroupBox } from "./GroupBox";
import styles from "../TextField/TextField.stories.module.css";

const meta: Meta<typeof GroupBox> = {
  title: "Componenti/GroupBox",
  component: GroupBox,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className={styles.stack}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof GroupBox>;

export const Default: Story = {
  tags: ["visual"],
  render: () => (
    <>
      <GroupBox legend="Orologio">
        <Checkbox defaultSelected>Mostra l'orologio</Checkbox>
        <Checkbox>Mostra i secondi</Checkbox>
      </GroupBox>
      <GroupBox legend="Aspetto">
        <RadioGroup label="Tema" defaultValue="classic">
          <Radio value="classic">Classico</Radio>
          <Radio value="high-contrast">Alto contrasto</Radio>
        </RadioGroup>
      </GroupBox>
    </>
  ),
};
