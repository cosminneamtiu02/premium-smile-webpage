import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Container } from "@/shared/components/ui/container/container";
import { Stack } from "@/shared/components/ui/stack/stack";
import { Text } from "@/shared/components/ui/text/text";

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-bg-subtle">
      <Container as="div" width="lg">
        <div className="grid gap-8 py-12 md:grid-cols-3">
          <Stack direction="column" gap="sm">
            <Text variant="small" className="font-semibold uppercase tracking-wide text-fg">
              {t("app_name")}
            </Text>
            <Text variant="muted">{t("footer.tagline")}</Text>
          </Stack>

          <Stack direction="column" gap="sm">
            <Text variant="small" className="font-semibold uppercase tracking-wide text-fg">
              {t("footer.contact")}
            </Text>
            <Stack direction="row" gap="xs" align="center">
              <Phone size={16} aria-hidden className="text-accent" />
              <Text variant="small">{t("footer.phone")}</Text>
            </Stack>
            <Stack direction="row" gap="xs" align="center">
              <Mail size={16} aria-hidden className="text-accent" />
              <Text variant="small">{t("footer.email")}</Text>
            </Stack>
            <Stack direction="row" gap="xs" align="start">
              <MapPin size={16} aria-hidden className="mt-1 shrink-0 text-accent" />
              <Text variant="small">{t("footer.address")}</Text>
            </Stack>
          </Stack>

          <Stack direction="column" gap="sm">
            <Text variant="small" className="font-semibold uppercase tracking-wide text-fg">
              {t("footer.hours_title")}
            </Text>
            <Text variant="small">{t("footer.hours_weekdays")}</Text>
            <Text variant="small">{t("footer.hours_saturday")}</Text>
            <Text variant="small" className="text-fg-muted">
              {t("footer.hours_sunday")}
            </Text>
          </Stack>
        </div>

        <div className="border-t border-border py-4 text-center">
          <Text variant="small">{t("footer.copyright", { year })}</Text>
        </div>
      </Container>
    </footer>
  );
}
