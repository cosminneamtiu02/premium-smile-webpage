import type { Meta, StoryObj } from "@storybook/react-vite";
import { type Doctor, DoctorCard } from "./doctor-card";

const ELENA: Doctor = {
  id: "elena-marin",
  name: "Dr. Elena Marin",
  roles: ["Founder", "Cosmetic Dentistry"],
  photo: {
    src: "https://api.dicebear.com/7.x/initials/svg?seed=EM&backgroundColor=8377a3&textColor=ffffff",
    alt: "Portrait of Dr. Elena Marin",
  },
  bio: "With over <b>fifteen years of experience</b> in aesthetic and restorative dentistry, Dr. Marin leads the clinic with a commitment to <b>detail driven, patient first care</b>. She specializes in <b>smile design, porcelain veneers, and full mouth rehabilitation</b>, blending modern digital techniques with timeless craftsmanship to create natural, lasting results.",
};

const ANDREI: Doctor = {
  id: "andrei-popescu",
  name: "Dr. Andrei Popescu",
  roles: ["Orthodontics", "Invisalign Specialist"],
  photo: {
    src: "https://api.dicebear.com/7.x/initials/svg?seed=AP&backgroundColor=8377a3&textColor=ffffff",
    alt: "Portrait of Dr. Andrei Popescu",
  },
  bio: [
    "Dr. Popescu transforms misaligned smiles into confident ones using both ",
    { bold: "traditional braces and clear aligners" },
    ". As a ",
    { bold: "certified Invisalign provider" },
    " with hundreds of completed cases, he tailors each treatment plan to the patient's lifestyle.",
  ],
};

const meta: Meta<typeof DoctorCard> = {
  title: "Composite/DoctorCard",
  component: DoctorCard,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof DoctorCard>;

export const ImageLeft: Story = {
  args: { doctor: ELENA, imageSide: "left", ctaLabel: "Book Consultation" },
};

export const ImageRight: Story = {
  args: { doctor: ANDREI, imageSide: "right", ctaLabel: "Book Consultation" },
};

const ELENA_NO_PHOTO: Doctor = {
  id: ELENA.id,
  name: ELENA.name,
  roles: ELENA.roles,
  bio: ELENA.bio,
};

export const TextOnly: Story = {
  args: { doctor: ELENA_NO_PHOTO, ctaLabel: "Book Consultation" },
};

export const NoCta: Story = {
  args: { doctor: ELENA, imageSide: "left" },
};

export const FirstInList: Story = {
  args: { doctor: ELENA, imageSide: "left", position: "first", ctaLabel: "Book Consultation" },
};

export const MiddleInList: Story = {
  args: { doctor: ANDREI, imageSide: "right", position: "middle", ctaLabel: "Book Consultation" },
};

export const LastInList: Story = {
  args: { doctor: ELENA, imageSide: "left", position: "last", ctaLabel: "Book Consultation" },
};
