import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import { HelpingStaffCard, type StaffMember } from "./helping-staff-card";

const STAFF: StaffMember = {
  id: "ana-georgescu",
  name: "Ana Georgescu",
  roles: ["Dental Assistant", "Patient Coordinator"],
  photo: {
    src: "https://example.com/ana.jpg",
    alt: "Portrait of Ana Georgescu",
  },
};

describe("HelpingStaffCard — a11y", () => {
  it("has no axe violations", async () => {
    const { container } = renderWithProviders(<HelpingStaffCard staff={STAFF} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
