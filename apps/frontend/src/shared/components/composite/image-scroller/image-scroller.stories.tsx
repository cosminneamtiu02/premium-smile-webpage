import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageScroller, type ScrollerImage } from "./image-scroller";

const IMAGES: ScrollerImage[] = [
  {
    src: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600",
    alt: "Modern dental treatment room with natural light",
    caption: "Treatment Room · Bucharest",
  },
  {
    src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600",
    alt: "Reception desk with soft pastel tones",
    caption: "Reception",
  },
  {
    src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600",
    alt: "Wide consultation room with patient chair",
    caption: "Consultation Suite",
  },
];

const meta: Meta<typeof ImageScroller> = {
  title: "Composite/ImageScroller",
  component: ImageScroller,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ImageScroller>;

export const Default: Story = {
  args: { images: IMAGES, autoPlay: false },
};

export const AutoPlay: Story = {
  args: { images: IMAGES, autoPlay: true, interval: 3000 },
};

export const SingleImage: Story = {
  args: {
    images: [
      {
        src: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1600",
        alt: "Modern dental treatment room with natural light",
        caption: "Treatment Room · Bucharest",
      },
    ],
  },
};

export const Empty: Story = {
  args: { images: [], aspectRatio: "16 / 9" },
};
