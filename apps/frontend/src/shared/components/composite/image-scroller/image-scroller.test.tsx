import { act, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test-utils";
import { ImageScroller } from "./image-scroller";

const IMAGES = [
  { src: "https://example.com/a.jpg", alt: "Treatment room" },
  { src: "https://example.com/b.jpg", alt: "Reception desk" },
  { src: "https://example.com/c.jpg", alt: "Waiting area" },
] as const;

describe("ImageScroller", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("marks the first image as the active slide on mount", () => {
    renderWithProviders(<ImageScroller images={[...IMAGES]} />);
    const slides = screen.getAllByRole("group", { name: /slide \d of 3/i });
    expect(slides[0]).toHaveAttribute("aria-current", "true");
    expect(slides[1]).toHaveAttribute("aria-current", "false");
  });

  it("advances on Next click", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    renderWithProviders(<ImageScroller images={[...IMAGES]} autoPlay={false} />);
    await user.click(screen.getByRole("button", { name: /next/i }));
    const slides = screen.getAllByRole("group", { name: /slide \d of 3/i });
    expect(slides[1]).toHaveAttribute("aria-current", "true");
  });

  it("auto-advances on the configured interval when autoPlay is on", () => {
    renderWithProviders(<ImageScroller images={[...IMAGES]} autoPlay interval={1000} />);
    let slides = screen.getAllByRole("group", { name: /slide \d of 3/i });
    expect(slides[0]).toHaveAttribute("aria-current", "true");
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    slides = screen.getAllByRole("group", { name: /slide \d of 3/i });
    expect(slides[1]).toHaveAttribute("aria-current", "true");
  });

  it("wraps from the last to the first slide", () => {
    renderWithProviders(<ImageScroller images={[...IMAGES]} autoPlay={false} />);
    const region = screen.getByRole("region", { name: /image gallery/i });
    region.focus();
    fireEvent.keyDown(region, { key: "ArrowLeft" });
    const slides = screen.getAllByRole("group", { name: /slide \d of 3/i });
    expect(slides[2]).toHaveAttribute("aria-current", "true");
  });

  it("renders empty when no images are passed", () => {
    renderWithProviders(<ImageScroller images={[]} />);
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument();
  });

  it("hides nav controls when only one image is provided", () => {
    const [first] = IMAGES;
    renderWithProviders(<ImageScroller images={[first]} />);
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument();
  });
});
