import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Container } from "@/shared/components/ui/container/container";
import { Heading } from "@/shared/components/ui/heading/heading";
import { Stack } from "@/shared/components/ui/stack/stack";
import { Text } from "@/shared/components/ui/text/text";

export const Route = createFileRoute("/$lang/blog")({
  component: BlogPage,
});

function BlogPage() {
  const { t } = useTranslation();
  return (
    <Container width="lg" className="py-12 sm:py-16">
      <Stack direction="column" gap="lg" align="start" className="mb-10 max-w-2xl">
        <Heading level={1}>{t("blog.title")}</Heading>
        <Text variant="lead">{t("blog.subtitle")}</Text>
      </Stack>

      <div className="rounded-xl border border-dashed border-border bg-bg-subtle px-6 py-16 text-center">
        <Text variant="muted">{t("blog.empty")}</Text>
      </div>
    </Container>
  );
}
