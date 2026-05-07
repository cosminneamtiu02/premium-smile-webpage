import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageStoryShell } from "@/pages/_story-utils";
import { TeamPage } from "./team-page";

const meta: Meta<typeof TeamPage> = {
  title: "Pages/Team",
  component: TeamPage,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof TeamPage>;

export const Default: Story = {
  render: () => (
    <PageStoryShell initialPath="/en/team">
      <TeamPage />
    </PageStoryShell>
  ),
};
