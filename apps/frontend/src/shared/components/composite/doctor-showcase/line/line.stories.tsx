import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShowcaseLine } from "./line";
import type { CardLayout } from "./line-path";

const meta: Meta<typeof ShowcaseLine> = {
  title: "Composite/DoctorShowcase/Line",
  component: ShowcaseLine,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof ShowcaseLine>;

const SHOWCASE_WIDTH = 800;

/**
 * Test scaffold that renders neutral card placeholders (no real DoctorCard
 * dependency yet) plus a scroll-tall outer container, so the ViewTimeline
 * has somewhere to scroll. The data-doctor-showcase attribute on the inner
 * wrapper is what ShowcaseLine looks for as its timeline subject.
 */
function ShowcaseScaffold({ cards, label }: { cards: ReadonlyArray<CardLayout>; label: string }) {
  const last = cards[cards.length - 1];
  const cardsHeight = last ? last.top + last.height : 0;

  return (
    <div
      style={{
        background: "var(--bg)",
        minHeight: "260vh",
        padding: "20vh 1.5rem 40vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <p
        style={{
          maxWidth: SHOWCASE_WIDTH,
          marginBottom: "2rem",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          color: "var(--fg-muted)",
          fontSize: "0.875rem",
        }}
      >
        Scroll down: the line draws pixel-by-pixel along the polyline at a per-segment pace. Scroll
        up: it un-draws. Layout: <strong>{label}</strong>.
      </p>
      <div
        data-doctor-showcase
        style={{
          position: "relative",
          width: SHOWCASE_WIDTH,
          height: cardsHeight,
        }}
      >
        {cards.map((card, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: stable card list per story
            key={i}
            style={{
              position: "absolute",
              top: card.top,
              left: 0,
              right: 0,
              height: card.height,
              background: "var(--bg-subtle)",
              borderRadius: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              color: "var(--fg)",
              fontWeight: 600,
            }}
          >
            Card {i + 1} — imageSide:{card.imageSide}
          </div>
        ))}
        <ShowcaseLine cards={cards} width={SHOWCASE_WIDTH} />
      </div>
    </div>
  );
}

export const SingleCard: Story = {
  render: () => (
    <ShowcaseScaffold
      label="only (1 card, left)"
      cards={[{ top: 0, height: 360, imageSide: "left" }]}
    />
  ),
};

export const TwoCards: Story = {
  render: () => (
    <ShowcaseScaffold
      label="first + last (2 cards, L → R)"
      cards={[
        { top: 0, height: 360, imageSide: "left" },
        { top: 416, height: 360, imageSide: "right" },
      ]}
    />
  ),
};

export const ThreeCards: Story = {
  render: () => (
    <ShowcaseScaffold
      label="first + middle + last (3 cards, L → R → L)"
      cards={[
        { top: 0, height: 360, imageSide: "left" },
        { top: 416, height: 360, imageSide: "right" },
        { top: 832, height: 360, imageSide: "left" },
      ]}
    />
  ),
};

export const FourCards: Story = {
  render: () => (
    <ShowcaseScaffold
      label="4 cards (L → R → L → R)"
      cards={[
        { top: 0, height: 320, imageSide: "left" },
        { top: 376, height: 320, imageSide: "right" },
        { top: 752, height: 320, imageSide: "left" },
        { top: 1128, height: 320, imageSide: "right" },
      ]}
    />
  ),
};

export const VaryingHeights: Story = {
  render: () => (
    <ShowcaseScaffold
      label="3 cards with mixed heights (180 / 480 / 280)"
      cards={[
        { top: 0, height: 180, imageSide: "left" },
        { top: 236, height: 480, imageSide: "right" },
        { top: 772, height: 280, imageSide: "left" },
      ]}
    />
  ),
};
