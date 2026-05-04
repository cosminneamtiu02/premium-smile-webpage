import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stars } from "./stars";

const meta: Meta<typeof Stars> = {
  title: "UI/Stars",
  component: Stars,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Stars>;

export const FiveStars: Story = { args: { value: 5 } };
export const ThreeStars: Story = { args: { value: 3 } };
export const ZeroStars: Story = { args: { value: 0 } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Stars value={5} size={12} />
      <Stars value={5} size={16} />
      <Stars value={5} size={20} />
      <Stars value={5} size={28} />
    </div>
  ),
};

export const LocalizedLabel: Story = {
  args: { value: 4, label: "4 stele din 5" },
};
