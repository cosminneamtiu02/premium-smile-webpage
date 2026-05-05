import type { Ref } from "react";
import { SectionHeading } from "@/shared/components/composite/section-heading/section-heading";
import { Button } from "@/shared/components/ui/button/button";
import { RichText, type RichTextPart } from "@/shared/components/ui/rich-text/rich-text";
import { cn } from "@/shared/lib/cn";

export type Doctor = {
  /** Stable identifier — used internally for keys and aria associations. */
  id: string;
  /** Full display name, e.g. "Dr. Elena Marin". */
  name: string;
  /** Role fragments joined visually with " · ", e.g. ["Founder", "Cosmetic Dentistry"]. */
  roles: ReadonlyArray<string>;
  /** Portrait. Omit on cards where you only have text — the layout still works. */
  photo?: { src: string; alt: string };
  /**
   * Bio. Two equivalent shapes:
   *  - marker string: "With over <b>fifteen years</b> of experience…"
   *  - typed array:  ["With over ", { bold: "fifteen years" }, " of experience…"]
   */
  bio: string | ReadonlyArray<RichTextPart>;
};

type DoctorCardProps = {
  doctor: Doctor;
  /** On md+ viewports, place the photo on this side. Mobile always hides the photo. */
  imageSide?: "left" | "right";
  /** Optional CTA below the bio. Omit for a text-only card. */
  ctaLabel?: string;
  onCta?: () => void;
  /** Forwarded to the root <article>. Used by DoctorShowcase to measure layout. */
  ref?: Ref<HTMLElement>;
  className?: string;
};

const ROLE_SEPARATOR = " · ";

export function DoctorCard({
  doctor,
  imageSide = "left",
  ctaLabel,
  onCta,
  ref,
  className,
}: DoctorCardProps) {
  const headingId = `doctor-${doctor.id}-name`;
  const eyebrowText = doctor.roles.join(ROLE_SEPARATOR);
  const isTextOnly = !doctor.photo;

  const bioContent =
    typeof doctor.bio === "string" ? (
      <RichText value={doctor.bio} />
    ) : (
      <RichText parts={doctor.bio} />
    );

  const photoBlock = doctor.photo ? (
    <div
      className={cn(
        "hidden md:flex md:w-1/2 md:items-center md:justify-center md:p-6",
        imageSide === "right" && "md:order-2",
      )}
    >
      <div className="aspect-square w-full max-w-[240px] overflow-hidden rounded-xl border border-border-subtle bg-bg-subtle shadow-soft-md">
        <img
          src={doctor.photo.src}
          alt={doctor.photo.alt}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  ) : null;

  return (
    <article
      ref={ref}
      aria-labelledby={headingId}
      className={cn(
        "relative flex w-full flex-col gap-4 rounded-2xl bg-bg-subtle shadow-soft-sm",
        // Mobile is ALWAYS text-only-style: photo is hidden, content centered.
        // px-10 keeps content beyond the decorative line drawn by the parent
        // showcase (24-30px from each edge).
        "px-10 py-8",
        // md+ branches: text-only cards stay centered with generous padding;
        // cards with a photo become a horizontal split with no outer padding.
        isTextOnly ? "md:p-12" : "md:flex-row md:items-center md:gap-0 md:p-0",
        className,
      )}
    >
      {photoBlock}

      {/* Inner vertical divider between image and text — only when md+ split layout is active. */}
      {!isTextOnly && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-8 bottom-8 left-1/2 hidden w-px -translate-x-1/2 bg-accent-soft md:block"
        />
      )}

      <div
        className={cn(
          // Mobile is always centered, regardless of whether the doctor has a photo.
          "flex flex-col items-center gap-3 text-center",
          // md+ branches:
          isTextOnly
            ? "md:mx-auto md:max-w-3xl"
            : "md:w-1/2 md:items-start md:justify-center md:p-8 md:text-left",
          !isTextOnly && imageSide === "right" && "md:order-1",
        )}
      >
        <SectionHeading
          eyebrow={eyebrowText}
          title={doctor.name}
          level={3}
          visualLevel={2}
          id={headingId}
          align="center"
          {...(isTextOnly ? {} : { mdAlign: "start" })}
        />
        <p
          className={cn(
            // Bio body is always justified — even when the heading is centered
            // and the block itself sits centered in the card. The text-only
            // case keeps the block constrained to max-w-2xl for readability;
            // the photo case removes that cap at md+ since the column is
            // already half-width.
            "text-base leading-relaxed text-fg-muted text-justify hyphens-auto",
            isTextOnly ? "max-w-2xl" : "max-w-2xl md:max-w-none",
          )}
        >
          {bioContent}
        </p>
        {ctaLabel && (
          <div className={cn("mt-4 w-full max-w-md", !isTextOnly && "md:self-center")}>
            <Button {...(onCta ? { onClick: onCta } : {})} className="w-full" size="lg">
              {ctaLabel}
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
