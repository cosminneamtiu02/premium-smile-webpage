import { act, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "@/shared/components/ui/button/button";
import { renderWithProviders } from "@/test-utils";
import { Hero, type HeroSlide } from "./hero";

const SLIDES: ReadonlyArray<HeroSlide> = [
  { src: "https://example.com/a.jpg", alt: "Treatment room", title: "Calm, modern care" },
  { src: "https://example.com/b.jpg", alt: "Reception", title: "A team that listens" },
  { src: "https://example.com/c.jpg", alt: "Waiting area", title: "Crafted treatments" },
];

const renderHero = (overrides: Partial<React.ComponentProps<typeof Hero>> = {}) =>
  renderWithProviders(
    <Hero
      slides={SLIDES}
      ctaPrimary={<Button>Book a consultation</Button>}
      ctaSecondary={<Button variant="outline">See our services</Button>}
      {...overrides}
    />,
  );

describe("Hero", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the active slide's title and the first slide as current on mount", () => {
    renderHero();
    // Non-active titles are aria-hidden, so the accessible heading query
    // returns only the visible (first-slide) one.
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Calm, modern care");
    const groups = screen.getAllByRole("group", { name: /slide \d+ of 3/i });
    expect(groups[0]).toHaveAttribute("aria-current", "true");
    expect(groups[1]).toHaveAttribute("aria-current", "false");
  });

  it("renders both CTA buttons", () => {
    renderHero();
    expect(screen.getByRole("button", { name: /book a consultation/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /see our services/i })).toBeInTheDocument();
  });

  it("auto-advances the slide and the visible heading in lockstep", () => {
    renderHero({ intervalMs: 1000 });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Calm, modern care");
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    const groups = screen.getAllByRole("group", { name: /slide \d+ of 3/i });
    expect(groups[1]).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("A team that listens");
  });

  it("dot click jumps to that slide and resets the auto-advance timer", () => {
    renderHero({ intervalMs: 1000 });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    const dots = screen.getAllByRole("button", { name: /slide \d+ of 3/i });
    act(() => {
      // biome-ignore lint/style/noNonNullAssertion: index 2 exists since SLIDES has 3 items
      fireEvent.click(dots[2]!);
    });
    let groups = screen.getAllByRole("group", { name: /slide \d+ of 3/i });
    expect(groups[2]).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Crafted treatments");
    act(() => {
      vi.advanceTimersByTime(500);
    });
    groups = screen.getAllByRole("group", { name: /slide \d+ of 3/i });
    expect(groups[2]).toHaveAttribute("aria-current", "true");
    act(() => {
      vi.advanceTimersByTime(500);
    });
    groups = screen.getAllByRole("group", { name: /slide \d+ of 3/i });
    expect(groups[0]).toHaveAttribute("aria-current", "true");
  });

  it("renders single-slide without dots and does not auto-advance", () => {
    const single: ReadonlyArray<HeroSlide> = [
      { src: "https://example.com/a.jpg", alt: "Treatment room", title: "Calm, modern care" },
    ];
    renderHero({ slides: single, intervalMs: 1000 });
    expect(screen.queryAllByRole("button", { name: /slide \d+ of 1/i })).toHaveLength(0);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    const group = screen.getByRole("group", { name: /slide 1 of 1/i });
    expect(group).toHaveAttribute("aria-current", "true");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Calm, modern care");
  });

  it("does not crash on empty slides array", () => {
    renderHero({ slides: [] });
    // No slides → no titles, no slide groups. CTAs still render so the user
    // can act even in this degenerate state.
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /book a consultation/i })).toBeInTheDocument();
    expect(screen.queryAllByRole("group", { name: /slide/i })).toHaveLength(0);
  });
});
