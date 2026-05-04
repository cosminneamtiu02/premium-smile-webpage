import type { Meta, StoryObj } from "@storybook/react-vite";
import { Eyebrow } from "./eyebrow";

const meta: Meta<typeof Eyebrow> = {
  title: "UI/Eyebrow",
  component: Eyebrow,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Eyebrow>;

export const Default: Story = {
  args: { children: "What we do" },
};

export const InContext: Story = {
  render: () => (
    <div className="space-y-2">
      <Eyebrow>Patient stories</Eyebrow>
      <p className="text-2xl text-fg">Five star care, in their own words.</p>
    </div>
  ),
};

export const RoleSeparated: Story = {
  args: { children: "Founder · Cosmetic Dentistry" },
};
