import type { Meta, StoryObj } from "@storybook/react-vite";
import { Link } from "./link";

const meta: Meta<typeof Link> = {
  title: "UI/Link",
  component: Link,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    href: "https://premium-smile.example.com",
    children: "Visit the clinic website",
  },
};

export const Muted: Story = {
  args: {
    href: "https://premium-smile.example.com",
    children: "Terms & conditions",
    variant: "muted",
  },
};

export const NavStyle: Story = {
  args: {
    href: "#services",
    children: "Services",
    variant: "nav",
  },
};
