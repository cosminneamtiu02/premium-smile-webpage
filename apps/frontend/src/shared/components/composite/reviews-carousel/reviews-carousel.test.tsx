import { fireEvent, screen, within } from "@testing-library/react";
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

function getCenterSlide() {
  const slides = screen.getAllByRole("group", { name: /review \d of \d/i });
  const current = slides.find((el) => el.getAttribute("aria-current") === "true");
  if (!current) throw new Error("No slide is aria-current");
  return current;
}

describe("ReviewsCarousel", () => {
  it("marks the centered slide aria-current=true on mount", () => {
    renderWithProviders(<ReviewsCarousel reviews={REVIEWS} />);
    // 3 reviews → centerIdx = floor(3/2) = 1 → middle review (Title B) is current.
    const center = getCenterSlide();
    expect(within(center).getByText("Title B")).toBeInTheDocument();
  });

  it("advances the centered slide when Next is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewsCarousel reviews={REVIEWS} />);
    expect(within(getCenterSlide()).getByText("Title B")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(within(getCenterSlide()).getByText("Title C")).toBeInTheDocument();
  });

  it("wraps via Previous from the start", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ReviewsCarousel reviews={REVIEWS} />);
    expect(within(getCenterSlide()).getByText("Title B")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(within(getCenterSlide()).getByText("Title A")).toBeInTheDocument();
  });

  it("navigates with ArrowRight / ArrowLeft when the carousel has focus", () => {
    renderWithProviders(<ReviewsCarousel reviews={REVIEWS} />);
    const region = screen.getByRole("region", { name: /reviews/i });
    region.focus();
    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(within(getCenterSlide()).getByText("Title C")).toBeInTheDocument();
    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(within(getCenterSlide()).getByText("Title B")).toBeInTheDocument();
  });

  it("renders an empty state when there are no reviews", () => {
    renderWithProviders(<ReviewsCarousel reviews={[]} />);
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("group", { name: /review/i })).not.toBeInTheDocument();
  });
});
