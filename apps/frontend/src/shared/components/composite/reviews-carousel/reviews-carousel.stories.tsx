import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Review } from "@/shared/components/composite/review-card/review-card";
import { ReviewsCarousel } from "./reviews-carousel";

const REVIEWS: Review[] = [
  {
    id: "1",
    name: "Andreea Popescu",
    role: "Veneers patient",
    title: "Confidence restored",
    text: "Premium Smile transformed my confidence. The team explained every step, and the result is the smile I dreamed of.",
    rating: 5,
    avatar: {
      src: "https://api.dicebear.com/7.x/initials/svg?seed=AP&backgroundColor=8377a3&textColor=ffffff",
      alt: "Avatar of Andreea Popescu",
    },
  },
  {
    id: "2",
    name: "Mihai Ionescu",
    role: "Implants",
    title: "Calm, professional, kind",
    text: "From consultation to follow-up, the experience felt like a spa, not a clinic. I cannot recommend them enough.",
    rating: 5,
    avatar: {
      src: "https://api.dicebear.com/7.x/initials/svg?seed=MI&backgroundColor=8377a3&textColor=ffffff",
      alt: "Avatar of Mihai Ionescu",
    },
  },
  {
    id: "3",
    name: "Elena Dumitru",
    role: "Whitening",
    title: "Worth every minute",
    text: "I drove two hours each way and would do it again. Painless, gorgeous results, and the kindest staff.",
    rating: 5,
  },
  {
    id: "4",
    name: "Radu Marin",
    role: "Routine cleaning",
    title: "First clinic without fear",
    text: "I have always been anxious at the dentist. Here, for the first time, I felt completely safe.",
    rating: 4,
  },
];

const meta: Meta<typeof ReviewsCarousel> = {
  title: "Composite/ReviewsCarousel",
  component: ReviewsCarousel,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ReviewsCarousel>;

export const Default: Story = { args: { reviews: REVIEWS } };

export const Empty: Story = { args: { reviews: [] } };

export const SingleReview: Story = {
  args: {
    reviews: [
      {
        id: "1",
        name: "Andreea Popescu",
        role: "Veneers patient",
        title: "Confidence restored",
        text: "Premium Smile transformed my confidence. The team explained every step.",
        rating: 5,
      },
    ],
  },
};
