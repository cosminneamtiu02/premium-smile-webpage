import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/shared/components/ui/button/button";
import { Hero, type HeroSlide } from "./hero";

const SLIDES: HeroSlide[] = [
  {
    src: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600",
    alt: "Modern dental treatment room with natural light",
    title: "A modern dental practice for the whole family",
  },
  {
    src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600",
    alt: "Reception desk with soft pastel tones",
    title: "A team that listens, in your language",
  },
  {
    src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1600",
    alt: "Confident patient smiling in natural light",
    title: "Treatments crafted like a luxury studio",
  },
];

const PRIMARY = <Button>Book a consultation</Button>;
const SECONDARY = <Button variant="outline">See our services</Button>;

const meta: Meta<typeof Hero> = {
  title: "Composite/Hero",
  component: Hero,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Default: Story = {
  args: {
    slides: SLIDES,
    ctaPrimary: PRIMARY,
    ctaSecondary: SECONDARY,
  },
};

export const FastInterval: Story = {
  args: {
    slides: SLIDES,
    intervalMs: 1500,
    ctaPrimary: PRIMARY,
    ctaSecondary: SECONDARY,
  },
};

const FIRST_SLIDE: HeroSlide = {
  src: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600",
  alt: "Modern dental treatment room with natural light",
  title: "A modern dental practice for the whole family",
};

export const SingleSlide: Story = {
  args: {
    slides: [FIRST_SLIDE],
    ctaPrimary: PRIMARY,
    ctaSecondary: SECONDARY,
  },
};

export const LongTitle: Story = {
  args: {
    slides: [
      {
        ...FIRST_SLIDE,
        title:
          "A modern, calm, family-first dental practice with treatments designed around your life — not the other way around",
      },
    ],
    ctaPrimary: PRIMARY,
    ctaSecondary: SECONDARY,
  },
};

export const Empty: Story = {
  args: {
    slides: [],
    ctaPrimary: PRIMARY,
    ctaSecondary: SECONDARY,
  },
};
