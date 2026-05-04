import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import { FloatingBookCta } from "./floating-book-cta";

describe("FloatingBookCta — a11y", () => {
  it("has no axe violations as a link", async () => {
    const { container } = renderWithProviders(<FloatingBookCta href="tel:+40700000000" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations as a button", async () => {
    const { container } = renderWithProviders(<FloatingBookCta onClick={() => {}} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
