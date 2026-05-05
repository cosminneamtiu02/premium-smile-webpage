import type { Meta, StoryObj } from "@storybook/react-vite";
import { MapFrame } from "./map-frame";

// Public Bucharest landmark — Universitatea București — used as a stable
// embed URL for the stories. Swap with the actual clinic URL when known.
const SAMPLE_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.4488!2d26.1003!3d44.4356" +
  "!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff465e6f76db%3A0x4d8b0a5e0a8a0f8e" +
  "!2sUniversitatea+din+Bucuresti!5e0!3m2!1sen!2sro!4v1700000000000!5m2!1sen!2sro";

const meta: Meta<typeof MapFrame> = {
  title: "UI/MapFrame",
  component: MapFrame,
  parameters: { layout: "padded" },
  args: {
    embedSrc: SAMPLE_EMBED,
    title: "Map showing Universitatea București",
  },
};

export default meta;
type Story = StoryObj<typeof MapFrame>;

export const Default: Story = {};

export const VideoAspect: Story = {
  args: { aspect: "video" },
};

export const SquareAspect: Story = {
  args: { aspect: "square" },
};
