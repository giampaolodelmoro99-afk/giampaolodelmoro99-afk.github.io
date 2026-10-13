import type { Meta, StoryObj } from "@storybook/react-vite";
import { BevelTokens, ColorTokens, Typography } from "./TokenGallery";

const meta = {
  title: "Fondamenta/Token",
  tags: ["visual"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Colori: Story = { render: () => <ColorTokens /> };

export const Bevel: Story = { render: () => <BevelTokens /> };

export const Tipografia: Story = { render: () => <Typography /> };
