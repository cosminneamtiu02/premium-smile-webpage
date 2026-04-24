import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Container } from "@/shared/components/ui/container/container";
import { Heading } from "@/shared/components/ui/heading/heading";
import { Stack } from "@/shared/components/ui/stack/stack";
import { Text } from "@/shared/components/ui/text/text";

export const Route = createFileRoute("/$lang/pricing")({
  component: PricingPage,
});

const PLACEHOLDER_TIERS = ["consult", "cleaning", "whitening"] as const;

function PricingPage() {
  const { t } = useTranslation();
  return (
    <Container width="lg" className="py-12 sm:py-16">
      <Stack direction="column" gap="lg" align="start" className="mb-10 max-w-2xl">
        <Heading level={1}>{t("pricing.title")}</Heading>
        <Text variant="lead">{t("pricing.subtitle")}</Text>
      </Stack>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PLACEHOLDER_TIERS.map((key) => (
          <article
            key={key}
            className="flex flex-col rounded-xl border border-border bg-bg-elevated p-6"
          >
            <Heading level={3} visualLevel={4}>
              {t(`pricing.tiers.${key}.name`)}
            </Heading>
            <Text variant="muted" className="mt-2 flex-1">
              {t(`pricing.tiers.${key}.description`)}
            </Text>
            <Text className="mt-6 text-2xl font-bold text-accent">
              {t(`pricing.tiers.${key}.price`)}
            </Text>
          </article>
        ))}
      </div>

      <Text variant="small" className="mt-10 text-center">
        {t("pricing.disclaimer")}
      </Text>
    </Container>
  );
}
