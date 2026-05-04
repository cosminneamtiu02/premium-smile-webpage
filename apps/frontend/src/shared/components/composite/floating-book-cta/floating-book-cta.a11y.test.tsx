import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import { FloatingBookCta } from "./floating-book-cta";

describe("FloatingBookCta — a11y", () => {
  it("has no axe violations as a link", async () => {
    renderWithProviders(<FloatingBookCta href="tel:+40700000000" />);
    // Portaled to document.body, so axe must scope to the portaled element.
    const link = screen.getByRole("link");
    expect(await axe(link)).toHaveNoViolations();
  });

  it("has no axe violations as a button", async () => {
    renderWithProviders(<FloatingBookCta onClick={() => {}} />);
    const button = screen.getByRole("button");
    expect(await axe(button)).toHaveNoViolations();
  });
});
