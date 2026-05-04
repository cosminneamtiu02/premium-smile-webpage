import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-accent text-accent-fg shadow-soft-sm hover:bg-accent-hover hover:-translate-y-px hover:shadow-cta active:translate-y-0 active:shadow-soft-sm",
  destructive:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 hover:-translate-y-px hover:shadow-lg active:translate-y-0 active:shadow-sm",
  outline:
    "border border-border bg-bg-elevated text-fg hover:bg-accent-soft hover:border-accent hover:text-accent hover:-translate-y-px active:translate-y-0",
  ghost: "text-fg hover:bg-bg-subtle",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "px-4 py-2 text-sm",
  sm: "px-3 py-1.5 text-xs",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "default",
  size = "default",
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded font-medium transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      disabled={disabled}
      {...props}
    />
  );
}
