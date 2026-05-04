import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heart, Mail, Phone } from "lucide-react";
import { IconButton } from "./icon-button";

const meta: Meta<typeof IconButton> = {
  title: "UI/IconButton",
  component: IconButton,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: { label: "Open menu", icon: <Heart aria-hidden /> },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <IconButton size="sm" label="Small" icon={<Heart aria-hidden />} />
      <IconButton size="md" label="Medium" icon={<Heart aria-hidden />} />
      <IconButton size="lg" label="Large" icon={<Heart aria-hidden />} />
    </div>
  ),
};

export const AsLink: Story = {
  args: {
    label: "Call us",
    icon: <Phone aria-hidden />,
    href: "tel:+40700000000",
    external: false,
  },
};

export const ColorOverride: Story = {
  render: () => (
    <div className="flex gap-3">
      <IconButton label="Default tone" icon={<Mail aria-hidden />} />
      <IconButton
        label="Subtle tone"
        icon={<Mail aria-hidden />}
        className="border-transparent bg-bg-subtle text-fg hover:bg-fg hover:text-bg"
      />
      <IconButton
        label="Filled tone"
        icon={<Mail aria-hidden />}
        className="border-transparent bg-accent text-accent-fg hover:bg-accent-hover"
      />
    </div>
  ),
};
