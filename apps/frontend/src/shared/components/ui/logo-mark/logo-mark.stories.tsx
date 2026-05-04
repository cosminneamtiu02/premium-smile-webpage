import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogoMark } from "./logo-mark";

const meta: Meta<typeof LogoMark> = {
  title: "UI/LogoMark",
  component: LogoMark,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof LogoMark>;

export const Default: Story = { args: { size: 32 } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <LogoMark size={20} />
      <LogoMark size={28} />
      <LogoMark size={40} />
      <LogoMark size={64} />
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <LogoMark size={32} className="text-accent" />
      <LogoMark size={32} className="text-fg" />
      <div className="rounded-md bg-accent p-3">
        <LogoMark size={32} className="text-fg-on-accent" />
      </div>
    </div>
  ),
};
