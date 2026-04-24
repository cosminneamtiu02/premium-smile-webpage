import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./text";

const meta: Meta<typeof Text> = {
  title: "UI/Text",
  component: Text,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const AllVariants: Story = {
  render: () => (
    <div className="max-w-xl space-y-4">
      <Text variant="lead">
        Lead paragraph — used directly under a heading for an introductory statement.
      </Text>
      <Text>
        Body text — the default for prose. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Suspendisse ac fringilla augue.
      </Text>
      <Text variant="muted">Muted text — secondary information, captions, timestamps.</Text>
      <Text variant="small">Small text — fine print, attribution, footer notes.</Text>
    </div>
  ),
};
