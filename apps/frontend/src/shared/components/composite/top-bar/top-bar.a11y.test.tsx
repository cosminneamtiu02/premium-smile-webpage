import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import { TopBar } from "./top-bar";

const ITEMS = [
  { key: "home", label: "Home" },
  { key: "pricing", label: "Pricing" },
  { key: "blog", label: "Blog" },
];

describe("TopBar — a11y", () => {
  it("has no axe violations with full nav + CTA", async () => {
    const { container } = renderWithProviders(
      <TopBar items={ITEMS} activeKey="home" bookLabel="Book Now" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with no CTA", async () => {
    const { container } = renderWithProviders(<TopBar items={ITEMS} activeKey="pricing" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with the mobile menu open and CTA in the panel", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(
      <TopBar items={ITEMS} activeKey="home" bookLabel="Book Now" />,
    );
    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(await axe(container)).toHaveNoViolations();
  });
});
