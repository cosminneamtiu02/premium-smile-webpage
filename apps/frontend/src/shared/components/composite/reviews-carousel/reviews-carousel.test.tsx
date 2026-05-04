import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { Review } from "@/shared/components/composite/review-card/review-card";
import { renderWithProviders } from "@/test-utils";
import { ReviewsCarousel } from "./reviews-carousel";

const REVIEWS: Review[] = [
  { id: "a", name: "A", role: "Patient", title: "Title A", text: "Text A.", rating: 5 },
  { id: "b", name: "B", role: "Patient", title: "Title B", text: "Text B.", rating: 5 },
  { id: "c", name: "C", role: "Patient", title: "Title C", text: "Text C.", rating: 5 },
];

describe("ReviewsCarousel", () => {
  it("renders the first review as current on mount", () => {
    renderWithProviders(<ReviewsCarousel reviews={REVIEWS} />);
    const slides = screen.getAllByRole("group", { name: /review \d of 3/i });
    expect(slides[0]).toHaveAttribute("aria-current", "true");
    expect(slides[1]).toHaveAttribute("aria-current", "false");
  });

  it("advances to the next review when Next is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewsCarousel reviews={REVIEWS} />);
    await user.click(screen.getByRole("button", { name: /next/i }));
    const slides = screen.getAllByRole("group", { name: /review \d of 3/i });
    expect(slides[1]).toHaveAttribute("aria-current", "true");
  });

  it("wraps to the last review when Previous is pressed at the start", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewsCarousel reviews={REVIEWS} />);
    await user.click(screen.getByRole("button", { name: /previous/i }));
    const slides = screen.getAllByRole("group", { name: /review \d of 3/i });
    expect(slides[2]).toHaveAttribute("aria-current", "true");
  });

  it("navigates with ArrowRight / ArrowLeft when the carousel has focus", () => {
    renderWithProviders(<ReviewsCarousel reviews={REVIEWS} />);
    const region = screen.getByRole("region", { name: /reviews/i });
    region.focus();
    fireEvent.keyDown(region, { key: "ArrowRight" });
    let slides = screen.getAllByRole("group", { name: /review \d of 3/i });
    expect(slides[1]).toHaveAttribute("aria-current", "true");
    fireEvent.keyDown(region, { key: "ArrowLeft" });
    slides = screen.getAllByRole("group", { name: /review \d of 3/i });
    expect(slides[0]).toHaveAttribute("aria-current", "true");
  });

  it("renders an empty state when there are no reviews", () => {
    renderWithProviders(<ReviewsCarousel reviews={[]} />);
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument();
  });
});
