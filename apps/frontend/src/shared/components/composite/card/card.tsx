import type { ReactNode } from "react";
import { Heading } from "@/shared/components/ui/heading/heading";
import { Text } from "@/shared/components/ui/text/text";
import { cn } from "@/shared/lib/cn";

type CardProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function Card({ title, description, icon, footer, className }: CardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-xl border border-border bg-bg-elevated p-6 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-bg-subtle text-accent">
          {icon}
        </div>
      )}
      <Heading level={3} visualLevel={4}>
        {title}
      </Heading>
      {description && (
        <Text variant="muted" className="mt-2 flex-1">
          {description}
        </Text>
      )}
      {footer && <div className="mt-4">{footer}</div>}
    </article>
  );
}
