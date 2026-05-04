import { act, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "@/shared/components/ui/button/button";
import { renderWithProviders } from "@/test-utils";
import { Hero, type HeroSlide } from "./hero";

const SLIDES: ReadonlyArray<HeroSlide> = [
  { src: "https://example.com/a.jpg", alt: "Treatment room", description: "Room desc." },
  { src: "https://example.com/b.jpg", alt: "Reception", description: "Reception desc." },
  { src: "https://example.com/c.jpg", alt: "Waiting area", description: "Waiting desc." },
];

const renderHero = (overrides: Partial<React.ComponentProps<typeof Hero>> = {}) =>
  renderWithProviders(
    <Hero
      title="Welcome to Premium Smile"
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

  it("renders the title and the first slide as current on mount", () => {
    renderHero();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Welcome to Premium Smile");
    const groups = screen.getAllByRole("group", { name: /slide \d+ of 3/i });
    expect(groups[0]).toHaveAttribute("aria-current", "true");
    expect(groups[1]).toHaveAttribute("aria-current", "false");
  });

  it("renders both CTA buttons", () => {
    renderHero();
    expect(screen.getByRole("button", { name: /book a consultation/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /see our services/i })).toBeInTheDocument();
  });

  it("auto-advances on the configured interval", () => {
    renderHero({ intervalMs: 1000 });
    let groups = screen.getAllByRole("group", { name: /slide \d+ of 3/i });
    expect(groups[0]).toHaveAttribute("aria-current", "true");
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    groups = screen.getAllByRole("group", { name: /slide \d+ of 3/i });
    expect(groups[1]).toHaveAttribute("aria-current", "true");
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
      { src: "https://example.com/a.jpg", alt: "Treatment room", description: "Room desc." },
    ];
    renderHero({ slides: single, intervalMs: 1000 });
    expect(screen.queryAllByRole("button", { name: /slide \d+ of 1/i })).toHaveLength(0);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    const group = screen.getByRole("group", { name: /slide 1 of 1/i });
    expect(group).toHaveAttribute("aria-current", "true");
  });

  it("does not crash on empty slides array", () => {
    renderHero({ slides: [] });
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /book a consultation/i })).toBeInTheDocument();
    expect(screen.queryAllByRole("group", { name: /slide/i })).toHaveLength(0);
  });
});
