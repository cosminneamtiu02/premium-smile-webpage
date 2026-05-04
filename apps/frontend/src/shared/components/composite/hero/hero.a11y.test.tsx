import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "@/shared/components/ui/button/button";
import { renderWithProviders } from "@/test-utils";
import { Hero, type HeroSlide } from "./hero";

const SLIDE_A: HeroSlide = {
  src: "https://example.com/a.jpg",
  alt: "Calm treatment room with natural light",
  description: "A calmer, kinder approach to modern dentistry.",
};
const SLIDE_B: HeroSlide = {
  src: "https://example.com/b.jpg",
  alt: "Reception desk with soft tones",
  description: "Veneers, whitening, and aligners delivered with care.",
};

const PRIMARY = <Button>Book a consultation</Button>;
const SECONDARY = <Button variant="outline">See our services</Button>;

describe("Hero — a11y", () => {
  it("has no axe violations with multiple slides", async () => {
    const { container } = renderWithProviders(
      <Hero
        title="Welcome to Premium Smile"
        slides={[SLIDE_A, SLIDE_B]}
        ctaPrimary={PRIMARY}
        ctaSecondary={SECONDARY}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with a single slide", async () => {
    const { container } = renderWithProviders(
      <Hero
        title="Welcome to Premium Smile"
        slides={[SLIDE_A]}
        ctaPrimary={PRIMARY}
        ctaSecondary={SECONDARY}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with an empty slides array", async () => {
    const { container } = renderWithProviders(
      <Hero
        title="Welcome to Premium Smile"
        slides={[]}
        ctaPrimary={PRIMARY}
        ctaSecondary={SECONDARY}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
