import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { renderWithProviders } from "@/test-utils";
import type { StaffMember } from "./helping-staff-card/helping-staff-card";
import { HelpingStaffGrid } from "./helping-staff-grid";

const STAFF: ReadonlyArray<StaffMember> = [
  {
    id: "ana-georgescu",
    name: "Ana Georgescu",
    roles: ["Dental Assistant"],
    photo: { src: "https://example.com/ana.jpg", alt: "Portrait of Ana Georgescu" },
  },
  {
    id: "mihai-ionescu",
    name: "Mihai Ionescu",
    roles: ["Dental Hygienist"],
    photo: { src: "https://example.com/mihai.jpg", alt: "Portrait of Mihai Ionescu" },
  },
  {
    id: "raluca-pop",
    name: "Raluca Pop",
    roles: ["Office Manager"],
    photo: { src: "https://example.com/raluca.jpg", alt: "Portrait of Raluca Pop" },
  },
];

describe("HelpingStaffGrid — a11y", () => {
  it("has no axe violations with three staff members", async () => {
    const { container } = renderWithProviders(
      <HelpingStaffGrid staff={STAFF} sectionTitle="Our helping staff" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with an eyebrow", async () => {
    const { container } = renderWithProviders(
      <HelpingStaffGrid
        staff={STAFF}
        sectionEyebrow="Behind every appointment"
        sectionTitle="Our helping staff"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
