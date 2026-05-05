import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClinicLocation } from "./clinic-location";

// Public Bucharest landmark — Universitatea București — used as a stable
// embed URL for the stories. Swap with the actual clinic URL when known.
const SAMPLE_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.4488!2d26.1003!3d44.4356" +
  "!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff465e6f76db%3A0x4d8b0a5e0a8a0f8e" +
  "!2sUniversitatea+din+Bucuresti!5e0!3m2!1sen!2sro!4v1700000000000!5m2!1sen!2sro";

const SAMPLE_DIRECTIONS =
  "https://www.google.com/maps/dir/?api=1&destination=Universitatea+Bucuresti";

const meta: Meta<typeof ClinicLocation> = {
  title: "Composite/ClinicLocation",
  component: ClinicLocation,
  parameters: { layout: "fullscreen" },
  args: {
    eyebrow: "Find us",
    title: "Visit our clinic",
    embedSrc: SAMPLE_EMBED,
    mapTitle: "Map showing Premium Smile clinic location",
    directionsHref: SAMPLE_DIRECTIONS,
    address: "Strada Ana Ipătescu nr. 11, București",
    directionsLabel: "Get directions to Strada Ana Ipătescu nr. 11, București",
    phone: "+40 700 000 000",
    callLabel: "Call +40 700 000 000",
  },
};

export default meta;
type Story = StoryObj<typeof ClinicLocation>;

export const Default: Story = {};

export const LongAddress: Story = {
  args: {
    address:
      "Bulevardul Iuliu Maniu nr. 546-560, Sector 6, etaj 3, lângă stația de metrou Lujerului, București 061129",
    directionsLabel:
      "Get directions to Bulevardul Iuliu Maniu nr. 546-560, Sector 6, etaj 3, lângă stația de metrou Lujerului, București 061129",
  },
};
