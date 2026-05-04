import type { Meta, StoryObj } from "@storybook/react-vite";
import { FloatingBookCta } from "./floating-book-cta";

const meta: Meta<typeof FloatingBookCta> = {
  title: "Composite/FloatingBookCta",
  component: FloatingBookCta,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof FloatingBookCta>;

const ScrollableShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-bg">
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-12 text-fg-muted">
      <h1 className="text-3xl text-fg">Sample page content</h1>
      {Array.from({ length: 18 }, (_, i) => `paragraph-${i + 1}`).map((id, i) => (
        <p key={id}>
          Sample paragraph {i + 1}. Scroll the viewport — the round phone button stays pinned to the
          bottom-right corner. Filled lavender at rest, outlined-elevated on hover (mirroring the
          footer social IconButtons in reverse).
        </p>
      ))}
    </div>
    {children}
  </div>
);

export const AsLink: Story = {
  args: { href: "tel:+40700000000" },
  render: (args) => (
    <ScrollableShell>
      <FloatingBookCta {...args} />
    </ScrollableShell>
  ),
};

export const AsButton: Story = {
  args: { onClick: () => alert("Booking clicked") },
  render: (args) => (
    <ScrollableShell>
      <FloatingBookCta {...args} />
    </ScrollableShell>
  ),
};
