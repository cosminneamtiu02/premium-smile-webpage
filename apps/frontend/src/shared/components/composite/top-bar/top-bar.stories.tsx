import type { Meta, StoryObj } from "@storybook/react-vite";
import { TopBar } from "./top-bar";

const meta: Meta<typeof TopBar> = {
  title: "Composite/TopBar",
  component: TopBar,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof TopBar>;

const ITEMS = [
  { key: "home", label: "Home" },
  { key: "treatments", label: "Treatments" },
  { key: "team", label: "Team" },
  { key: "pricing", label: "Pricing" },
  { key: "blog", label: "Blog" },
];

/**
 * The TopBar is an overlay (height: 0). The story shell starts with a
 * lavender hero so you can actually see the bar's translucent glass effect
 * — over a flat white surface the bar would just look solid. Below the
 * hero, a stack of paragraphs lets you scroll-test the shadow change.
 */
const ScrollableShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-bg">
    {children}
    <div className="relative h-[420px] w-full overflow-hidden bg-accent-soft">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--accent)_0%,_transparent_55%),_radial-gradient(circle_at_75%_60%,_var(--accent-hover)_0%,_transparent_60%)] opacity-50"
      />
      <div className="relative z-10 mx-auto flex h-full max-w-3xl items-end px-6 pb-12">
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-fg-muted">
            Premium Smile · Bucharest
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-fg sm:text-5xl">
            Dentistry, designed around you.
          </h1>
        </div>
      </div>
    </div>
    <div className="mx-auto max-w-3xl space-y-6 px-6 pb-24 pt-12 text-justify text-fg-muted hyphens-auto">
      {Array.from({ length: 12 }, (_, i) => `paragraph-${i + 1}`).map((id, i) => (
        <p key={id}>
          Sample content paragraph {i + 1}. Scroll the viewport to see the bar shift from a 96%
          translucent rest state with a soft drop shadow to an 86% translucent scrolled state with a
          stronger lavender shadow. Hover the nav links to watch the underline scale in. Click the
          hamburger on a phone-width viewport — the panel appears below the bar without pushing the
          paragraphs.
        </p>
      ))}
    </div>
  </div>
);

export const Default: Story = {
  args: {
    brandLabel: "Premium Smile",
    items: ITEMS,
    activeKey: "home",
    bookLabel: "Book Now",
  },
  render: (args) => (
    <ScrollableShell>
      <TopBar {...args} />
    </ScrollableShell>
  ),
};

export const NoCta: Story = {
  args: {
    brandLabel: "Premium Smile",
    items: ITEMS,
    activeKey: "treatments",
  },
  render: (args) => (
    <ScrollableShell>
      <TopBar {...args} />
    </ScrollableShell>
  ),
};

export const FewItems: Story = {
  args: {
    brandLabel: "Premium Smile",
    items: [
      { key: "home", label: "Home" },
      { key: "pricing", label: "Pricing" },
    ],
    activeKey: "home",
    bookLabel: "Book Now",
  },
  render: (args) => (
    <ScrollableShell>
      <TopBar {...args} />
    </ScrollableShell>
  ),
};
