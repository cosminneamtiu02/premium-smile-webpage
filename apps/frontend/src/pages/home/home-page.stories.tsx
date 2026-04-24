import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageStoryShell } from "@/pages/_story-utils";
import { HomePage } from "./home-page";

const meta: Meta<typeof HomePage> = {
  title: "Pages/Home",
  component: HomePage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof HomePage>;

export const Default: Story = {
  render: () => (
    <PageStoryShell initialPath="/en">
      <HomePage />
    </PageStoryShell>
  ),
};
