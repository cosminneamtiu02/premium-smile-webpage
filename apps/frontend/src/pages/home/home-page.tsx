import { Sparkles, Stethoscope, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/shared/components/composite/card/card";
import { Hero, type HeroSlide } from "@/shared/components/composite/hero/hero";
import { Button } from "@/shared/components/ui/button/button";
import { Container } from "@/shared/components/ui/container/container";
import { Heading } from "@/shared/components/ui/heading/heading";

const SLIDE_IMAGES: Record<"calm" | "team" | "result", string> = {
  calm: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600",
  team: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600",
  result:
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1600",
};

export function HomePage() {
  const { t } = useTranslation();

  const slides: HeroSlide[] = (["calm", "team", "result"] as const).map((id) => ({
    src: SLIDE_IMAGES[id],
    alt: t(`home.hero.slides.${id}.alt`),
    description: t(`home.hero.slides.${id}.description`),
  }));

  return (
    <>
      <Hero
        title={t("home.hero.title")}
        slides={slides}
        ctaPrimary={<Button>{t("home.hero.cta_primary")}</Button>}
        ctaSecondary={<Button variant="outline">{t("home.hero.cta_secondary")}</Button>}
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
