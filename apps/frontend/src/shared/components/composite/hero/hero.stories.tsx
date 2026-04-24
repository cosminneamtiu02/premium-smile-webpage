import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/shared/components/ui/button/button";
import { Hero } from "./hero";

const meta: Meta<typeof Hero> = {
  title: "Composite/Hero",
  component: Hero,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const TextOnly: Story = {
  args: {
    title: "Welcome to Premium Smile",
    subtitle: "A modern dental practice committed to your comfort and care.",
  },
};

export const WithCta: Story = {
  args: {
    title: "Welcome to Premium Smile",
    subtitle: "A modern dental practice committed to your comfort and care.",
    cta: (
      <>
        <Button>Book a consultation</Button>
        <Button variant="outline">See our services</Button>
      </>
    ),
  },
};

export const WithImagePlaceholder: Story = {
  args: {
    title: "Welcome to Premium Smile",
    subtitle: "A modern dental practice committed to your comfort and care.",
    cta: <Button>Book a consultation</Button>,
    image: (
      <div className="flex h-full w-full items-center justify-center text-fg-muted">
        Hero image placeholder
      </div>
    ),
  },
};
