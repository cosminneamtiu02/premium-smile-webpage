import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => <Input placeholder="Enter your name" />,
};

export const Disabled: Story = {
  render: () => <Input placeholder="Disabled" disabled />,
};

export const TypeEmail: Story = {
  render: () => <Input type="email" placeholder="you@example.com" />,
};
