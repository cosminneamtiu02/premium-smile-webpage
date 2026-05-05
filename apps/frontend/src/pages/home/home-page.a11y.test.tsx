import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AXE_OPTIONS_FOR_IFRAME, renderPageWithLayout } from "@/test-utils";
import { HomePage } from "./home-page";

describe("HomePage — a11y", () => {
  it("has no axe violations (full layout, EN)", async () => {
    const { container } = renderPageWithLayout(<HomePage />, "/en");
    expect(await axe(container, AXE_OPTIONS_FOR_IFRAME)).toHaveNoViolations();
  });
});
