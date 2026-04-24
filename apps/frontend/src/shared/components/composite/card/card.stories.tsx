import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles } from "lucide-react";
import { Card } from "./card";

const meta: Meta<typeof Card> = {
  title: "Composite/Card",
  component: Card,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  args: {
    title: "General Dentistry",
    description: "Routine check-ups, cleanings, and preventive care for the whole family.",
  },
};

export const WithIcon: Story = {
  args: {
    title: "Cosmetic Treatments",
    description: "Whitening, veneers, and smile design tailored to you.",
    icon: <Sparkles size={20} aria-hidden />,
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card
        title="General Dentistry"
        description="Cleanings, fillings, preventive care."
        icon={<Sparkles size={20} />}
      />
      <Card
        title="Cosmetic"
        description="Whitening, veneers, smile design."
        icon={<Sparkles size={20} />}
      />
      <Card
        title="Orthodontics"
        description="Braces and clear aligners for all ages."
        icon={<Sparkles size={20} />}
      />
    </div>
  ),
};
