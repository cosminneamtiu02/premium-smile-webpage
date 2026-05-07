import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderPageWithLayout } from "@/test-utils";
import { TeamPage } from "./team-page";

describe("TeamPage — a11y", () => {
  it("has no axe violations (full layout, EN)", async () => {
    const { container } = renderPageWithLayout(<TeamPage />, "/en/team");
    expect(await axe(container)).toHaveNoViolations();
  });
});
