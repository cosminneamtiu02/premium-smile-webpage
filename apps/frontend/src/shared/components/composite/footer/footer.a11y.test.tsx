import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import { Footer } from "./footer";

describe("Footer — a11y", () => {
  it("has no axe violations", async () => {
    const { container } = renderWithProviders(<Footer />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
