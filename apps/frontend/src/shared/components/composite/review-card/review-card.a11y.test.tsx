import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import { type Review, ReviewCard } from "./review-card";

const REVIEW: Review = {
  id: "r1",
  name: "Andreea Popescu",
  role: "Veneers patient",
  title: "Confidence restored",
  text: "Premium Smile transformed my confidence.",
  rating: 5,
  avatar: { src: "https://example.com/a.jpg", alt: "Avatar of Andreea Popescu" },
};

describe("ReviewCard — a11y", () => {
  it("has no axe violations with avatar", async () => {
    const { container } = renderWithProviders(<ReviewCard review={REVIEW} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations without avatar (initials fallback)", async () => {
    const { container } = renderWithProviders(
      <ReviewCard
        review={{
          id: REVIEW.id,
          name: REVIEW.name,
          role: REVIEW.role,
          title: REVIEW.title,
          text: REVIEW.text,
          rating: REVIEW.rating,
        }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations when emphasized", async () => {
    const { container } = renderWithProviders(<ReviewCard review={REVIEW} emphasized />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
