import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/shared/lib/cn";

type ContainerWidth = "sm" | "md" | "lg" | "xl" | "full";

type ContainerProps = {
  width?: ContainerWidth;
  as?: "div" | "section" | "article" | "header" | "footer" | "nav" | "main";
} & ComponentPropsWithoutRef<"div">;

const WIDTHS: Record<ContainerWidth, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
};

export function Container({
  width = "lg",
  as = "div",
  className,
  children,
  ...props
}: ContainerProps) {
  const Tag = as;
  return (
    <Tag className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", WIDTHS[width], className)} {...props}>
      {children}
    </Tag>
  );
}
