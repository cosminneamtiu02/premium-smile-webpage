import { Sparkles } from "lucide-react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import { Card } from "./card";

describe("Card — a11y", () => {
  it("has no axe violations with text only", async () => {
    const { container } = renderWithProviders(
      <Card title="General Dentistry" description="Routine check-ups and cleanings." />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with an icon", async () => {
    const { container } = renderWithProviders(
      <Card
        title="Cosmetic Treatments"
        description="Whitening and veneers."
        icon={<Sparkles size={20} aria-hidden />}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
