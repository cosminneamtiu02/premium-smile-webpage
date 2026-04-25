import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderPageWithLayout } from "@/test-utils";
import { PricingPage } from "./pricing-page";

describe("PricingPage — a11y", () => {
  it("has no axe violations (full layout, EN)", async () => {
    const { container } = renderPageWithLayout(<PricingPage />, "/en/pricing");
    expect(await axe(container)).toHaveNoViolations();
  });
});
