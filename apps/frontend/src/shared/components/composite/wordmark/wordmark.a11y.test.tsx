import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import { Wordmark } from "./wordmark";

describe("Wordmark — a11y", () => {
  it("has no axe violations with the visible label", async () => {
    const { container } = renderWithProviders(<Wordmark />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations when the label is sr-only", async () => {
    const { container } = renderWithProviders(<Wordmark showLabel={false} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
