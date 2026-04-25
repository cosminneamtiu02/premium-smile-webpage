import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithRouter } from "@/test-utils";
import { NavBar } from "./nav-bar";

describe("NavBar — a11y", () => {
  it("has no axe violations on the desktop layout", async () => {
    const { container } = renderWithRouter(<NavBar />, { initialPath: "/en" });
    expect(await axe(container)).toHaveNoViolations();
  });
});
