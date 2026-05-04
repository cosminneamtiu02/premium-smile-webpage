import type { Meta, StoryObj } from "@storybook/react-vite";
import { Wordmark } from "./wordmark";

const meta: Meta<typeof Wordmark> = {
  title: "Composite/Wordmark",
  component: Wordmark,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Wordmark>;

export const Default: Story = { args: {} };

export const MarkOnly: Story = { args: { showLabel: false, size: 32 } };

export const Larger: Story = { args: { size: 36 } };

export const OnAccent: Story = {
  render: () => (
    <div className="rounded-lg bg-accent p-4">
      <Wordmark tone="text-fg-on-accent" />
    </div>
  ),
};
