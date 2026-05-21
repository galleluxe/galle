import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: "Add to Bag", variant: "primary" },
};

export const Secondary: Story = {
  args: { children: "Discover", variant: "secondary" },
};

export const Ghost: Story = {
  args: { children: "View All", variant: "ghost" },
};
