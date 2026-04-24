import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/lib/cn";

type TextVariant = "body" | "lead" | "small" | "muted";

type TextProps = {
  variant?: TextVariant;
  as?: "p" | "span" | "div";
} & ComponentPropsWithoutRef<"p">;

const VARIANTS: Record<TextVariant, string> = {
  body: "text-base leading-relaxed text-fg",
  lead: "text-lg leading-relaxed text-fg sm:text-xl",
  small: "text-sm leading-normal text-fg-muted",
  muted: "text-base leading-relaxed text-fg-muted",
};

export function Text({ variant = "body", as = "p", className, children, ...props }: TextProps) {
  const Tag = as;
  return (
    <Tag className={cn(VARIANTS[variant], className)} {...props}>
      {children}
    </Tag>
  );
}
