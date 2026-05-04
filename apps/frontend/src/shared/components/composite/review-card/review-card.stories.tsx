import type { Meta, StoryObj } from "@storybook/react-vite";
import { type Review, ReviewCard } from "./review-card";

const REVIEW: Review = {
  id: "andreea-popescu",
  name: "Andreea Popescu",
  role: "Veneers patient",
  title: "Confidence restored",
  text: "Premium Smile transformed my confidence. The team explained every step, and the result is the smile I dreamed of.",
  rating: 5,
  avatar: {
    src: "https://api.dicebear.com/7.x/initials/svg?seed=AP&backgroundColor=8377a3&textColor=ffffff",
    alt: "Avatar of Andreea Popescu",
  },
};

const meta: Meta<typeof ReviewCard> = {
  title: "Composite/ReviewCard",
  component: ReviewCard,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ReviewCard>;

export const Default: Story = { args: { review: REVIEW } };

export const Emphasized: Story = { args: { review: REVIEW, emphasized: true } };

export const NoAvatar: Story = {
  args: {
    review: {
      id: REVIEW.id,
      name: REVIEW.name,
      role: REVIEW.role,
      title: REVIEW.title,
      text: REVIEW.text,
      rating: REVIEW.rating,
    },
  },
};

export const PartialRating: Story = {
  args: { review: { ...REVIEW, rating: 4, title: "Almost perfect" } },
};
