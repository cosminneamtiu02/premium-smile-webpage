import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Doctor } from "./doctor-card/doctor-card";
import { DoctorShowcase } from "./doctor-showcase";

const TEAM: Doctor[] = [
  {
    id: "elena-marin",
    name: "Dr. Elena Marin",
    roles: ["Founder", "Cosmetic Dentistry"],
    photo: {
      src: "https://api.dicebear.com/7.x/initials/svg?seed=EM&backgroundColor=8377a3&textColor=ffffff",
      alt: "Portrait of Dr. Elena Marin",
    },
    bio: "With over <b>fifteen years of experience</b> in aesthetic and restorative dentistry, Dr. Marin leads the clinic with a commitment to <b>detail driven, patient first care</b>.",
  },
  {
    id: "andrei-popescu",
    name: "Dr. Andrei Popescu",
    roles: ["Orthodontics", "Invisalign Specialist"],
    photo: {
      src: "https://api.dicebear.com/7.x/initials/svg?seed=AP&backgroundColor=8377a3&textColor=ffffff",
      alt: "Portrait of Dr. Andrei Popescu",
    },
    bio: "Dr. Popescu transforms misaligned smiles into confident ones using both <b>traditional braces and clear aligners</b>.",
  },
  {
    id: "ioana-stoica",
    name: "Dr. Ioana Stoica",
    roles: ["General & Family Dentistry"],
    photo: {
      src: "https://api.dicebear.com/7.x/initials/svg?seed=IS&backgroundColor=8377a3&textColor=ffffff",
      alt: "Portrait of Dr. Ioana Stoica",
    },
    bio: "Known for her <b>gentle approach</b>, Dr. Stoica makes routine dental care a calm, reassuring experience.",
  },
];

const meta: Meta<typeof DoctorShowcase> = {
  title: "Composite/DoctorShowcase",
  component: DoctorShowcase,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof DoctorShowcase>;

export const Default: Story = {
  args: {
    doctors: TEAM,
    sectionEyebrow: "Five specialists. One shared standard of care.",
    sectionTitle: "Meet Our Team",
    ctaLabel: "Book Consultation",
  },
};

export const TextOnlyCards: Story = {
  args: {
    doctors: TEAM.map((d): Doctor => ({ id: d.id, name: d.name, roles: d.roles, bio: d.bio })),
    sectionEyebrow: "Five specialists. One shared standard of care.",
    sectionTitle: "Meet Our Team",
    ctaLabel: "Book Consultation",
  },
};

export const SingleDoctor: Story = {
  args: {
    doctors: TEAM.slice(0, 1),
    sectionTitle: "Meet Our Founder",
    ctaLabel: "Book Consultation",
  },
};

export const TwoDoctors: Story = {
  args: {
    doctors: TEAM.slice(0, 2),
    sectionTitle: "Meet Our Team",
    ctaLabel: "Book Consultation",
  },
};
