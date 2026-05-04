import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "@/shared/components/ui/button/button";
import { renderWithProviders } from "@/test-utils";
import { SectionHeading } from "./section-heading";

describe("SectionHeading — a11y", () => {
  it("has no axe violations with eyebrow + title", async () => {
    const { container } = renderWithProviders(
      <SectionHeading eyebrow="What we do" title="Treatments, all under one calm roof." />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with a trailing CTA", async () => {
    const { container } = renderWithProviders(
      <SectionHeading
        eyebrow="What we do"
        title="Treatments, all under one calm roof."
        trailing={<Button>All services and prices</Button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with semantic h3 + visual h2 (doctor block)", async () => {
    const { container } = renderWithProviders(
      <SectionHeading
        eyebrow="Founder · Cosmetic Dentistry"
        title="Dr. Elena Marin"
        level={3}
        visualLevel={2}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
