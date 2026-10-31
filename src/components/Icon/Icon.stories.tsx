import type { Meta, StoryObj } from "@storybook/react-vite";
import { Glyph } from "./Glyph";
import { Icon } from "./Icon";
import { glyphNames } from "./glyphData";
import { type IconName, iconNames, iconSizes } from "./iconData";
import styles from "./Icon.stories.module.css";

const meta = {
  title: "Componenti/Icon",
  component: Icon,
  tags: ["autodocs"],
  args: { name: "about", size: 32, scale: 1 },
  argTypes: {
    name: { control: "select", options: iconNames },
    size: { control: "inline-radio", options: [16, 32] },
    scale: { control: "inline-radio", options: [1, 2, 3] },
  },
} satisfies Meta<typeof Icon<IconName>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ConEtichetta: Story = {
  args: { name: "warning", size: 32, label: "Avviso" },
};

export const Tutte: Story = {
  tags: ["visual"],
  render: () => (
    <ul className={styles.grid}>
      {iconNames.map((name) => (
        <li key={name} className={styles.cell}>
          <span className={styles.icons}>
            {iconSizes[name].map((size) => (
              <Icon key={size} name={name} size={size} />
            ))}
          </span>
          <code>{name}</code>
        </li>
      ))}
    </ul>
  ),
};

export const Scala: Story = {
  render: () => (
    <p className={styles.icons}>
      <Icon name="gdm" size={16} />
      <Icon name="gdm" size={16} scale={2} />
      <Icon name="gdm" size={32} scale={2} />
      <Icon name="gdm" size={32} scale={3} />
    </p>
  ),
};

export const Glifi: Story = {
  tags: ["visual"],
  render: () => (
    <ul className={styles.grid}>
      {glyphNames.map((name) => (
        <li key={name} className={styles.cell}>
          <span className={styles.glyphs}>
            <Glyph name={name} />
          </span>
          <code>{name}</code>
        </li>
      ))}
    </ul>
  ),
};
