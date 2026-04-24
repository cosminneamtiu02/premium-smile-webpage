import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Stethoscope, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/shared/components/composite/card/card";
import { Hero } from "@/shared/components/composite/hero/hero";
import { Button } from "@/shared/components/ui/button/button";
import { Container } from "@/shared/components/ui/container/container";
import { Heading } from "@/shared/components/ui/heading/heading";

export const Route = createFileRoute("/$lang/")({
  component: HomePage,
});

function HomePage() {
  const { t } = useTranslation();
  return (
    <>
      <Hero
        title={t("home.hero.title")}
        subtitle={t("home.hero.subtitle")}
        cta={
          <>
            <Button>{t("home.hero.cta_primary")}</Button>
            <Button variant="outline">{t("home.hero.cta_secondary")}</Button>
          </>
        }
        image={
          <div className="flex h-full w-full items-center justify-center text-fg-muted">
            {t("home.hero.image_placeholder")}
          </div>
        }
      />

      <section className="py-12 sm:py-16">
        <Container width="lg">
          <div className="mb-8 max-w-2xl">
            <Heading level={2}>{t("home.services.title")}</Heading>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card
              title={t("home.services.general.title")}
              description={t("home.services.general.description")}
              icon={<Stethoscope size={20} aria-hidden />}
            />
            <Card
              title={t("home.services.cosmetic.title")}
              description={t("home.services.cosmetic.description")}
              icon={<Sparkles size={20} aria-hidden />}
            />
            <Card
              title={t("home.services.family.title")}
              description={t("home.services.family.description")}
              icon={<Users size={20} aria-hidden />}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
