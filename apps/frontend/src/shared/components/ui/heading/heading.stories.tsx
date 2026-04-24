import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "./heading";

const meta: Meta<typeof Heading> = {
  title: "UI/Heading",
  component: Heading,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const AllLevels: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading level={1}>Heading level 1</Heading>
      <Heading level={2}>Heading level 2</Heading>
      <Heading level={3}>Heading level 3</Heading>
      <Heading level={4}>Heading level 4</Heading>
      <Heading level={5}>Heading level 5</Heading>
      <Heading level={6}>Heading level 6</Heading>
    </div>
  ),
};

export const SemanticH2VisualH1: Story = {
  render: () => (
    <Heading level={2} visualLevel={1}>
      Semantic h2 with h1 sizing
    </Heading>
  ),
};
