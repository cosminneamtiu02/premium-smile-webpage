import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageStoryShell } from "@/pages/_story-utils";
import { BlogPage } from "./blog-page";

const meta: Meta<typeof BlogPage> = {
  title: "Pages/Blog",
  component: BlogPage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof BlogPage>;

export const Default: Story = {
  render: () => (
    <PageStoryShell initialPath="/en/blog">
      <BlogPage />
    </PageStoryShell>
  ),
};
