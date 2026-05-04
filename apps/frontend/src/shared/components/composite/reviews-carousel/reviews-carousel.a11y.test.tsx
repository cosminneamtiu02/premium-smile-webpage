import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import type { Review } from "@/shared/components/composite/review-card/review-card";
import { renderWithProviders } from "@/test-utils";
import { ReviewsCarousel } from "./reviews-carousel";

const REVIEWS: Review[] = [
  {
    id: "a",
    name: "Andreea Popescu",
    role: "Veneers patient",
    title: "Confidence restored",
    text: "Premium Smile transformed my confidence.",
    rating: 5,
    avatar: { src: "https://example.com/a.jpg", alt: "Avatar of Andreea Popescu" },
  },
  {
    id: "b",
    name: "Mihai Ionescu",
    role: "Implants",
    title: "Calm, professional, kind",
    text: "From consultation to follow-up, the experience felt like a spa.",
    rating: 5,
  },
];

describe("ReviewsCarousel — a11y", () => {
  it("has no axe violations with reviews", async () => {
    const { container } = renderWithProviders(<ReviewsCarousel reviews={REVIEWS} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations when empty", async () => {
    const { container } = renderWithProviders(<ReviewsCarousel reviews={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
