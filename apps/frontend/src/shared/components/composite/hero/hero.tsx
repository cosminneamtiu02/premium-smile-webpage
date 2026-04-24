import type { ReactNode } from "react";
import { Container } from "@/shared/components/ui/container/container";
import { Heading } from "@/shared/components/ui/heading/heading";
import { Stack } from "@/shared/components/ui/stack/stack";
import { Text } from "@/shared/components/ui/text/text";
import { cn } from "@/shared/lib/cn";

type HeroProps = {
  title: string;
  subtitle?: string;
  cta?: ReactNode;
  image?: ReactNode;
  className?: string;
};

export function Hero({ title, subtitle, cta, image, className }: HeroProps) {
  return (
    <section className={cn("py-12 sm:py-16 lg:py-24", className)}>
      <Container width="lg">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Stack direction="column" gap="lg" align="start">
            <Heading level={1}>{title}</Heading>
            {subtitle && (
              <Text variant="lead" className="max-w-xl">
                {subtitle}
              </Text>
            )}
            {cta && <div className="flex flex-wrap gap-3">{cta}</div>}
          </Stack>
          {image && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-bg-subtle">
              {image}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
