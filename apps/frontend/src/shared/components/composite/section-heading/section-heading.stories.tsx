import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/shared/components/ui/button/button";
import { SectionHeading } from "./section-heading";

const meta: Meta<typeof SectionHeading> = {
  title: "Composite/SectionHeading",
  component: SectionHeading,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof SectionHeading>;

export const Treatments: Story = {
  args: {
    eyebrow: "What we do",
    title: "Treatments, all under one calm roof.",
  },
};

export const Team: Story = {
  args: {
    eyebrow: "Five specialists. One shared standard of care.",
    title: "Meet Our Team",
  },
};

export const DoctorBlock: Story = {
  args: {
    eyebrow: "Founder · Cosmetic Dentistry",
    title: "Dr. Elena Marin",
    level: 3,
    visualLevel: 2,
  },
};

export const WithTrailingCta: Story = {
  args: {
    eyebrow: "What we do",
    title: "Treatments, all under one calm roof.",
    trailing: <Button variant="default">All services and prices</Button>,
  },
};

export const Centered: Story = {
  args: {
    eyebrow: "Patient stories",
    title: "Five star care, in their own words.",
    align: "center",
  },
};
