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

/**
 * Where this card sits inside a `Doctors` list. The decorative connecting
 * line uses this to know which segments to draw (top overhang on first card,
 * bottom overhang on last, gap-bridge between adjacent cards).
 */
export type DoctorCardPosition = "only" | "first" | "middle" | "last";

type DoctorCardProps = {
  doctor: Doctor;
  /** On md+ viewports, place the photo on this side. Mobile always hides the photo. */
  imageSide?: "left" | "right";
  /** Where this card sits in a list — drives the decorative line. Defaults to "only". */
  position?: DoctorCardPosition;
  /** Optional CTA below the bio. Omit for a text-only card. */
  ctaLabel?: string;
  onCta?: () => void;
  className?: string;
};

const ROLE_SEPARATOR = " · ";

// Geometry of the decorative line (matches the example's pixel grid).
const INSET = 24;
const LINE_W = 6;
const GAP = 56;
const OVERHANG = 32;
const GAP_HALF_MINUS_LINE = GAP / 2 - LINE_W / 2; // 25
const MIRROR_HEIGHT = GAP / 2 + LINE_W / 2; // 31

/**
 * The line stays on a single side at mobile width (no image alternation
 * to mirror), then flips to follow `imageSide` on md+. Mirror is always
 * the opposite side. Encoded as Tailwind classes so the breakpoint switch
 * is pure CSS.
 */
const LINE_SIDE_CLASS: Record<"left" | "right", string> = {
  left: "left-6",
  right: "left-6 md:left-auto md:right-6",
};
const MIRROR_SIDE_CLASS: Record<"left" | "right", string> = {
  left: "right-6",
  right: "right-6 md:right-auto md:left-6",
};

export function DoctorCard({
  doctor,
  imageSide = "left",
  position = "only",
  ctaLabel,
  onCta,
  className,
}: DoctorCardProps) {
  const headingId = `doctor-${doctor.id}-name`;
  const eyebrowText = doctor.roles.join(ROLE_SEPARATOR);
  const isFirst = position === "first" || position === "only";
  const isLast = position === "last" || position === "only";
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
      aria-labelledby={headingId}
      className={cn(
        "relative flex w-full flex-col gap-4 rounded-2xl bg-bg-subtle shadow-soft-sm",
        // Mobile is ALWAYS text-only-style: photo is hidden, content centered,
        // padding clears the decorative side line (left-6, w-1.5 → 24-30px).
        // px-10 keeps content beyond the line on both sides.
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

      {/* Decorative continuous line — visible at every breakpoint.
       * Sides stay on left/right at mobile (no alternation possible without
       * images), then mirror imageSide at md+. */}
      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute w-1.5 bg-accent", LINE_SIDE_CLASS[imageSide])}
        style={{
          top: isFirst ? -OVERHANG : 0,
          bottom: isLast ? -OVERHANG : -MIRROR_HEIGHT,
        }}
      />
      {isFirst && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-6 left-6 h-1.5 bg-accent"
          style={{ top: -OVERHANG }}
        />
      )}
      {!isLast && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-1.5 bg-accent"
            style={{
              top: `calc(100% + ${GAP_HALF_MINUS_LINE}px)`,
              left: INSET + LINE_W,
              right: INSET + LINE_W,
            }}
          />
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute w-1.5 bg-accent",
              MIRROR_SIDE_CLASS[imageSide],
            )}
            style={{
              top: `calc(100% + ${GAP_HALF_MINUS_LINE}px)`,
              height: MIRROR_HEIGHT,
            }}
          />
        </>
      )}
    </article>
  );
}
