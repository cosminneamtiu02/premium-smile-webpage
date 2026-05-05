import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderPageWithLayout } from "@/test-utils";
import { HomePage } from "./home-page";

describe("HomePage — a11y", () => {
  it("has no axe violations (full layout, EN)", async () => {
    const { container } = renderPageWithLayout(<HomePage />, "/en");
    // `iframes: false` because HomePage now embeds a Google Maps iframe via
    // ClinicLocation; jsdom does not load iframe content, so axe's cross-frame
    // recursion throws otherwise. See clinic-location.a11y.test.tsx for the full
    // explanation.
    expect(await axe(container, { iframes: false })).toHaveNoViolations();
  });
});
