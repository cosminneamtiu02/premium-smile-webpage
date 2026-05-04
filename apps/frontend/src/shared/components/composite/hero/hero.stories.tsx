import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/shared/components/ui/button/button";
import { Hero, type HeroSlide } from "./hero";

const SLIDES: HeroSlide[] = [
  {
    src: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600",
    alt: "Modern dental treatment room with natural light",
    description: "A calmer, kinder approach to modern dentistry, for the smile you actually want.",
  },
  {
    src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600",
    alt: "Reception desk with soft pastel tones",
    description: "Veneers, whitening, and aligners delivered with the craft of a luxury studio.",
  },
  {
    src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1600",
    alt: "Confident patient smiling in natural light",
    description:
      "Visits your kids look forward to. A separate pediatric room and a gentle, unhurried pace.",
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
    title: "A modern dental practice for the whole family",
    slides: SLIDES,
    ctaPrimary: PRIMARY,
    ctaSecondary: SECONDARY,
  },
};

export const FastInterval: Story = {
  args: {
    title: "A modern dental practice for the whole family",
    slides: SLIDES,
    intervalMs: 1500,
    ctaPrimary: PRIMARY,
    ctaSecondary: SECONDARY,
  },
};

const FIRST_SLIDE: HeroSlide = {
  src: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600",
  alt: "Modern dental treatment room with natural light",
  description: "A calmer, kinder approach to modern dentistry, for the smile you actually want.",
};

export const SingleSlide: Story = {
  args: {
    title: "A modern dental practice for the whole family",
    slides: [FIRST_SLIDE],
    ctaPrimary: PRIMARY,
    ctaSecondary: SECONDARY,
  },
};

export const LongDescription: Story = {
  args: {
    title: "A modern dental practice for the whole family",
    slides: [
      {
        ...FIRST_SLIDE,
        description:
          "From veneers and whitening to implants, orthodontics, and pediatric care, every treatment at Premium Smile is delivered with patience, precision, and a plan built around your life. Whether you need cosmetic restorations, clear aligners, preventive cleanings, or a gentle visit for your child, our team takes time, explains every step, and works around your schedule.",
      },
    ],
    ctaPrimary: PRIMARY,
    ctaSecondary: SECONDARY,
  },
};

export const Empty: Story = {
  args: {
    title: "A modern dental practice for the whole family",
    slides: [],
    ctaPrimary: PRIMARY,
    ctaSecondary: SECONDARY,
  },
};
