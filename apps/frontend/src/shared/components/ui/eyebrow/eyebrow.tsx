import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/lib/cn";

type EyebrowAs = "p" | "span" | "div";

type EyebrowProps = {
  as?: EyebrowAs;
} & ComponentPropsWithoutRef<"p">;

export function Eyebrow({ as = "p", className, children, ...props }: EyebrowProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "font-mono text-xs font-medium uppercase tracking-[0.18em] text-fg-muted",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
