import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageStoryShell } from "@/pages/_story-utils";
import { PricingPage } from "./pricing-page";

const meta: Meta<typeof PricingPage> = {
  title: "Pages/Pricing",
  component: PricingPage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof PricingPage>;

export const Default: Story = {
  render: () => (
    <PageStoryShell initialPath="/en/pricing">
      <PricingPage />
    </PageStoryShell>
  ),
};
