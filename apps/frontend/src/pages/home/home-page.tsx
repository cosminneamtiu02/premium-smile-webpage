import { useTranslation } from "react-i18next";
import { ClinicLocation } from "@/shared/components/composite/clinic-location/clinic-location";
import type { Doctor } from "@/shared/components/composite/doctor-showcase/doctor-card/doctor-card";
import { DoctorShowcase } from "@/shared/components/composite/doctor-showcase/doctor-showcase";
import { Hero, type HeroSlide } from "@/shared/components/composite/hero/hero";
import type { Review } from "@/shared/components/composite/review-card/review-card";
import { ReviewsCarousel } from "@/shared/components/composite/reviews-carousel/reviews-carousel";
import { SectionHeading } from "@/shared/components/composite/section-heading/section-heading";
import { Button } from "@/shared/components/ui/button/button";

const SLIDE_IMAGES: Record<"calm" | "team" | "result", string> = {
  calm: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600",
  team: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600",
  result:
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1600",
};

const DOCTOR_IDS = ["elena", "andrei", "mihai"] as const;

const portrait = (initials: string): { src: string; alt: string } => ({
  src: `https://api.dicebear.com/7.x/initials/svg?seed=${initials}&backgroundColor=8377a3&textColor=ffffff`,
  alt: `Portrait placeholder ${initials}`,
});

const REVIEW_KEYS = [
  "andreea",
  "mihai",
  "elena",
  "radu",
  "ioana",
  "cristian",
  "ana",
  "bogdan",
  "diana",
  "stefan",
  "larisa",
  "tudor",
] as const;
type ReviewKey = (typeof REVIEW_KEYS)[number];
const REVIEW_RATINGS: Record<ReviewKey, number> = {
  andreea: 5,
  mihai: 5,
  elena: 5,
  radu: 4,
  ioana: 5,
  cristian: 4,
  ana: 5,
  bogdan: 5,
  diana: 5,
  stefan: 5,
  larisa: 4,
  tudor: 5,
};

// Bucharest landmark placeholder — replace both URLs when the real clinic
// location is confirmed. Update CLINIC_EMBED_SRC by visiting Google Maps,
// pressing Share → Embed a map, and copying the iframe `src`. Update
// CLINIC_DIRECTIONS_HREF to a maps.app.goo.gl share link or a manual
// `https://www.google.com/maps/dir/?api=1&destination=...` URL.
// Also update the `SAMPLE_EMBED` constant in both Storybook stories
// (`shared/components/ui/map-frame/map-frame.stories.tsx` and
// `shared/components/composite/clinic-location/clinic-location.stories.tsx`)
// so the visual stays consistent between Storybook and the running site.
const CLINIC_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.4488!2d26.1003!3d44.4356" +
  "!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff465e6f76db%3A0x4d8b0a5e0a8a0f8e" +
  "!2sUniversitatea+din+Bucuresti!5e0!3m2!1sen!2sro!4v1700000000000!5m2!1sen!2sro";
const CLINIC_DIRECTIONS_HREF =
  "https://www.google.com/maps/dir/?api=1&destination=Universitatea+Bucuresti";

export function HomePage() {
  const { t } = useTranslation();

  const slides: HeroSlide[] = (["calm", "team", "result"] as const).map((id) => ({
    src: SLIDE_IMAGES[id],
    alt: t(`home.hero.slides.${id}.alt`),
    title: t(`home.hero.slides.${id}.title`),
  }));

  const reviews: Review[] = REVIEW_KEYS.map((key) => ({
    id: key,
    name: t(`home.reviews.items.${key}.name`),
    role: t(`home.reviews.items.${key}.role`),
    title: t(`home.reviews.items.${key}.title`),
    text: t(`home.reviews.items.${key}.text`),
    rating: REVIEW_RATINGS[key],
  }));

  const doctors: Doctor[] = DOCTOR_IDS.map((id) => ({
    id,
    name: t(`home.doctors.${id}.name`),
    roles: t(`home.doctors.${id}.roles`, { returnObjects: true }) as unknown as string[],
    photo: portrait(t(`home.doctors.${id}.initials`)),
    bio: t(`home.doctors.${id}.bio`),
  }));

  return (
    <>
      <Hero
        slides={slides}
        ctaPrimary={
          <Button className="border border-accent shadow-cta transition-all duration-200 ease-out hover:scale-105 hover:translate-y-0 hover:bg-bg-elevated hover:text-accent hover:border-accent hover:shadow-cta-lg active:scale-100">
            {t("home.hero.cta_primary")}
          </Button>
        }
        ctaSecondary={
          <Button className="border border-accent bg-bg-elevated text-accent shadow-cta transition-all duration-200 ease-out hover:scale-105 hover:translate-y-0 hover:bg-bg-subtle hover:text-accent hover:border-accent hover:shadow-cta-lg active:scale-100">
            {t("home.hero.cta_secondary")}
          </Button>
        }
      />

      <DoctorShowcase doctors={doctors} sectionTitle={t("home.doctors.title")} />

      <ClinicLocation
        eyebrow={t("home.location.eyebrow")}
        title={t("home.location.title")}
        embedSrc={CLINIC_EMBED_SRC}
        mapTitle={t("home.location.map_title")}
        directionsHref={CLINIC_DIRECTIONS_HREF}
        address={t("home.location.address")}
        directionsLabel={t("home.location.directions_label", {
          address: t("home.location.address"),
        })}
        phone={t("footer.phone")}
        callLabel={t("home.location.call_label", { phone: t("footer.phone") })}
      />

      <section className="py-12 sm:py-16">
        <div className="mb-8 pl-[clamp(48px,10vw,200px)] pr-[clamp(24px,5vw,46px)]">
          <SectionHeading
            eyebrow={t("home.reviews.eyebrow")}
            title={t("home.reviews.title")}
            align="start"
          />
        </div>
        <ReviewsCarousel
          reviews={reviews}
          ariaLabel={t("home.reviews.aria_label")}
          previousLabel={t("home.reviews.previous_label")}
          nextLabel={t("home.reviews.next_label")}
          navigateLabel={t("home.reviews.navigate_label")}
          starsLabel={(rating) => t("home.reviews.stars_label", { rating })}
        />
      </section>
    </>
  );
}
