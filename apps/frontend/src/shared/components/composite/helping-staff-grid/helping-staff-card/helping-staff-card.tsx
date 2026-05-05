import { SectionHeading } from "@/shared/components/composite/section-heading/section-heading";
import { cn } from "@/shared/lib/cn";

export type StaffMember = {
  /** Stable identifier — used for keys and aria associations. */
  id: string;
  /** Full display name, e.g. "Dr. Elena Marin". */
  name: string;
  /** Role fragments joined visually with " · ", e.g. ["Founder", "Cosmetic Dentistry"]. */
  roles: ReadonlyArray<string>;
  /** Portrait. Required — the card design hinges on it. */
  photo: { src: string; alt: string };
};

type HelpingStaffCardProps = {
  staff: StaffMember;
  className?: string;
};

const ROLE_SEPARATOR = " · ";

export function HelpingStaffCard({ staff, className }: HelpingStaffCardProps) {
  const headingId = `helping-staff-${staff.id}-name`;
  const eyebrowText = staff.roles.join(ROLE_SEPARATOR);

  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        // h-full so the card fills its grid cell when the grid uses
        // auto-rows-fr — keeps every card the same height regardless of how
        // many roles wrap onto a second line.
        "flex h-full flex-col items-center gap-4 rounded-2xl bg-bg-subtle p-6 text-center shadow-soft-sm",
        className,
      )}
    >
      <div className="aspect-square w-full max-w-[200px] overflow-hidden rounded-xl border border-border-subtle bg-bg-subtle shadow-soft-md">
        <img
          src={staff.photo.src}
          alt={staff.photo.alt}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      <SectionHeading
        eyebrow={eyebrowText}
        title={staff.name}
        level={3}
        align="center"
        id={headingId}
      />
    </article>
  );
}
