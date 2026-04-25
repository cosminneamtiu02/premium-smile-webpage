import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import { ThemeToggle } from "./theme-toggle";

describe("ThemeToggle — a11y", () => {
  it("has no axe violations", async () => {
    const { container } = renderWithProviders(<ThemeToggle />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
