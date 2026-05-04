import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import type { Doctor } from "@/shared/components/composite/doctor-card/doctor-card";
import { renderWithProviders } from "@/test-utils";
import { DoctorShowcase } from "./doctor-showcase";

const TEAM: Doctor[] = [
  {
    id: "a",
    name: "Dr. A",
    roles: ["Founder"],
    photo: { src: "https://example.com/a.jpg", alt: "Portrait of Dr. A" },
    bio: "Bio A with <b>bold</b>.",
  },
  {
    id: "b",
    name: "Dr. B",
    roles: ["Orthodontics"],
    photo: { src: "https://example.com/b.jpg", alt: "Portrait of Dr. B" },
    bio: "Bio B with <b>bold</b>.",
  },
];

describe("DoctorShowcase — a11y", () => {
  it("has no axe violations with photos + CTAs", async () => {
    const { container } = renderWithProviders(
      <DoctorShowcase
        doctors={TEAM}
        sectionEyebrow="Five specialists. One shared standard of care."
        sectionTitle="Meet Our Team"
        ctaLabel="Book Consultation"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations with text-only cards (mobile shape)", async () => {
    const { container } = renderWithProviders(
      <DoctorShowcase
        doctors={TEAM.map((d): Doctor => ({ id: d.id, name: d.name, roles: d.roles, bio: d.bio }))}
        sectionTitle="Meet Our Team"
        ctaLabel="Book Consultation"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
