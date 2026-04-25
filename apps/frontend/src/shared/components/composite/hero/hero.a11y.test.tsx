import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "@/shared/components/ui/button/button";
import { renderWithProviders } from "@/test-utils";
import { Hero } from "./hero";

describe("Hero — a11y", () => {
  it("has no axe violations with text and CTAs", async () => {
    const { container } = renderWithProviders(
      <Hero
        title="Welcome to Premium Smile"
        subtitle="A modern dental practice."
        cta={
          <>
            <Button>Book a consultation</Button>
            <Button variant="outline">See our services</Button>
          </>
        }
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
