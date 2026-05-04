import { Sparkles, Stethoscope, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/shared/components/composite/card/card";
import { Hero, type HeroSlide } from "@/shared/components/composite/hero/hero";
import type { Review } from "@/shared/components/composite/review-card/review-card";
import { ReviewsCarousel } from "@/shared/components/composite/reviews-carousel/reviews-carousel";
import { Button } from "@/shared/components/ui/button/button";
import { Container } from "@/shared/components/ui/container/container";
import { Heading } from "@/shared/components/ui/heading/heading";

const SLIDE_IMAGES: Record<"calm" | "team" | "result", string> = {
  calm: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600",
  team: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600",
  result:
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1600",
};

const REVIEW_KEYS = ["andreea", "mihai", "elena", "radu", "ioana", "cristian", "ana"] as const;
type ReviewKey = (typeof REVIEW_KEYS)[number];
const REVIEW_RATINGS: Record<ReviewKey, number> = {
  andreea: 5,
  mihai: 5,
  elena: 5,
  radu: 4,
  ioana: 5,
  cristian: 4,
  ana: 5,
};

export function HomePage() {
  const { t } = useTranslation();

  const slides: HeroSlide[] = (["calm", "team", "result"] as const).map((id) => ({
    src: SLIDE_IMAGES[id],
    alt: t(`home.hero.slides.${id}.alt`),
    description: t(`home.hero.slides.${id}.description`),
  }));

  const reviews: Review[] = REVIEW_KEYS.map((key) => ({
    id: key,
    name: t(`home.reviews.items.${key}.name`),
    role: t(`home.reviews.items.${key}.role`),
    title: t(`home.reviews.items.${key}.title`),
    text: t(`home.reviews.items.${key}.text`),
    rating: REVIEW_RATINGS[key],
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

      <section className="bg-bg-subtle py-12 sm:py-16">
        <Container width="lg">
          <div className="mb-8 max-w-2xl">
            <Heading level={2}>{t("home.reviews.title")}</Heading>
          </div>
          <ReviewsCarousel
            reviews={reviews}
            ariaLabel={t("home.reviews.aria_label")}
            previousLabel={t("home.reviews.previous_label")}
            nextLabel={t("home.reviews.next_label")}
            navigateLabel={t("home.reviews.navigate_label")}
            starsLabel={(rating) => t("home.reviews.stars_label", { rating })}
          />
        </Container>
      </section>
    </>
  );
}
