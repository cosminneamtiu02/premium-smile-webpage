import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/lib/cn";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingProps = {
  level: HeadingLevel;
  visualLevel?: HeadingLevel;
} & ComponentPropsWithoutRef<"h1">;

const VISUAL_CLASSES: Record<HeadingLevel, string> = {
  1: "text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl",
  2: "text-3xl font-bold tracking-tight sm:text-4xl",
  3: "text-2xl font-semibold tracking-tight sm:text-3xl",
  4: "text-xl font-semibold sm:text-2xl",
  5: "text-lg font-semibold",
  6: "text-base font-semibold",
};

export function Heading({ level, visualLevel, className, children, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  const effective = visualLevel ?? level;
  return (
    <Tag className={cn(VISUAL_CLASSES[effective], "text-fg", className)} {...props}>
      {children}
    </Tag>
  );
}
