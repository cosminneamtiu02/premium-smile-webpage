import type { Meta, StoryObj } from "@storybook/react-vite";
import { DateTime } from "./date-time";

const meta: Meta<typeof DateTime> = {
  title: "UI/DateTime",
  component: DateTime,
};

export default meta;
type Story = StoryObj<typeof DateTime>;

export const Default: Story = {
  args: {
    value: "2026-04-07T14:30:00Z",
  },
};
