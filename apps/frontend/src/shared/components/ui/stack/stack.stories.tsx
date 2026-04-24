import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stack } from "./stack";

const meta: Meta<typeof Stack> = {
  title: "UI/Stack",
  component: Stack,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Stack>;

function Block({ label }: { label: string }) {
  return <div className="rounded bg-accent px-4 py-2 text-accent-fg">{label}</div>;
}

export const Column: Story = {
  render: () => (
    <Stack direction="column" gap="md">
      <Block label="First" />
      <Block label="Second" />
      <Block label="Third" />
    </Stack>
  ),
};

export const RowWithBetween: Story = {
  render: () => (
    <Stack direction="row" gap="md" justify="between" align="center">
      <Block label="Left" />
      <Block label="Right" />
    </Stack>
  ),
};
