import { useTranslation } from "react-i18next";
import type { Doctor } from "@/shared/components/composite/doctor-showcase/doctor-card/doctor-card";
import { DoctorShowcase } from "@/shared/components/composite/doctor-showcase/doctor-showcase";
import type { StaffMember } from "@/shared/components/composite/helping-staff-grid/helping-staff-card/helping-staff-card";
import { HelpingStaffGrid } from "@/shared/components/composite/helping-staff-grid/helping-staff-grid";
import { SectionHeading } from "@/shared/components/composite/section-heading/section-heading";
import { Container } from "@/shared/components/ui/container/container";
import { Text } from "@/shared/components/ui/text/text";

const DOCTOR_IDS = ["elena", "andrei", "mihai"] as const;
const STAFF_IDS = ["ana", "raluca", "ioana"] as const;

const portrait = (initials: string): { src: string; alt: string } => ({
  src: `https://api.dicebear.com/7.x/initials/svg?seed=${initials}&backgroundColor=8377a3&textColor=ffffff`,
  alt: `Portrait placeholder ${initials}`,
});

export function TeamPage() {
  const { t } = useTranslation();

  const doctors: Doctor[] = DOCTOR_IDS.map((id) => ({
    id,
    name: t(`team.doctors.${id}.name`),
    roles: t(`team.doctors.${id}.roles`, { returnObjects: true }) as unknown as string[],
    photo: portrait(t(`team.doctors.${id}.initials`)),
    bio: t(`team.doctors.${id}.bio`),
  }));

  const staff: StaffMember[] = STAFF_IDS.map((id) => ({
    id,
    name: t(`team.helpingStaff.${id}.name`),
    roles: t(`team.helpingStaff.${id}.roles`, { returnObjects: true }) as unknown as string[],
    photo: portrait(t(`team.helpingStaff.${id}.initials`)),
  }));

  return (
    <>
      <section className="py-16 sm:py-20 lg:py-24">
        <Container width="lg">
          <SectionHeading
            eyebrow={t("team.intro.eyebrow")}
            title={t("team.intro.title")}
            level={1}
            align="center"
          />
          <Text variant="lead" className="mx-auto mt-8 max-w-3xl text-center text-fg-muted">
            {t("team.intro.dedication")}
          </Text>
        </Container>
      </section>

      <DoctorShowcase doctors={doctors} sectionTitle={t("team.doctors.title")} />

      <HelpingStaffGrid staff={staff} sectionTitle={t("team.helpingStaff.title")} />
    </>
  );
}
