import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "./container";

const meta: Meta<typeof Container> = {
  title: "UI/Container",
  component: Container,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const AllWidths: Story = {
  render: () => (
    <div className="space-y-4 bg-bg-subtle py-8">
      {(["sm", "md", "lg", "xl", "full"] as const).map((w) => (
        <Container key={w} width={w}>
          <div className="rounded-md border border-border bg-bg-elevated p-4 text-fg">
            width=<code>{w}</code>
          </div>
        </Container>
      ))}
    </div>
  ),
};
