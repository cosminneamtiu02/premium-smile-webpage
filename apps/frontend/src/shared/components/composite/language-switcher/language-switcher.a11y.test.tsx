import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import { LanguageSwitcher } from "./language-switcher";

describe("LanguageSwitcher — a11y", () => {
  it("has no axe violations", async () => {
    const { container } = renderWithProviders(<LanguageSwitcher />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
