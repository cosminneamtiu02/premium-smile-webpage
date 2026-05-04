import type { ReactNode } from "react";
import { Eyebrow } from "@/shared/components/ui/eyebrow/eyebrow";
import { Heading } from "@/shared/components/ui/heading/heading";
import { Stack } from "@/shared/components/ui/stack/stack";
import { cn } from "@/shared/lib/cn";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type Align = "start" | "center" | "end";

type SectionHeadingProps = {
  /** The small mono-uppercase label that sits above the title (e.g. "What we do"). */
  eyebrow?: string;
  /** The big title (e.g. "Treatments, all under one calm roof."). */
  title: string;
  /** Semantic heading level. Defaults to 2 — the only level matching most page sections. */
  level?: HeadingLevel;
  /** Override the visual size while keeping semantic level intact. */
  visualLevel?: HeadingLevel;
  /** Horizontal alignment of the eyebrow + heading block. Applied at every breakpoint
   *  unless `mdAlign` overrides it at md+. */
  align?: Align;
  /** Override `align` at the md breakpoint. Useful for layouts that are centered on
   *  mobile but left-aligned next to a side image at desktop. */
  mdAlign?: Align;
  /** Optional `id` set on the heading — useful for `aria-labelledby` on the wrapping section. */
  id?: string;
  /** Optional trailing slot — e.g. an "All services" button rendered next to the heading on wide viewports. */
  trailing?: ReactNode;
  className?: string;
};

const ALIGN_CLASS: Record<Align, string> = {
  start: "items-start text-left",
  center: "items-center text-center",
  end: "items-end text-right",
};

const MD_ALIGN_CLASS: Record<Align, string> = {
  start: "md:items-start md:text-left",
  center: "md:items-center md:text-center",
  end: "md:items-end md:text-right",
};

const STACK_MD_ALIGN_CLASS: Record<Align, string> = {
  start: "md:items-start",
  center: "md:items-center",
  end: "md:items-end",
};

const STACK_ALIGN: Record<Align, "start" | "center" | "end"> = {
  start: "start",
  center: "center",
  end: "end",
};

export function SectionHeading({
  eyebrow,
  title,
  level = 2,
  visualLevel,
  align = "start",
  mdAlign,
  id,
  trailing,
  className,
}: SectionHeadingProps) {
  const stack = (
    <Stack
      direction="column"
      gap="sm"
      align={STACK_ALIGN[align]}
      className={cn("min-w-0 flex-1", mdAlign && STACK_MD_ALIGN_CLASS[mdAlign])}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading level={level} {...(visualLevel ? { visualLevel } : {})} {...(id ? { id } : {})}>
        {title}
      </Heading>
    </Stack>
  );

  if (!trailing) {
    return (
      <div
        className={cn(
          "flex w-full",
          ALIGN_CLASS[align],
          mdAlign && MD_ALIGN_CLASS[mdAlign],
          className,
        )}
      >
        {stack}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      {stack}
      <div className="shrink-0">{trailing}</div>
    </div>
  );
}
