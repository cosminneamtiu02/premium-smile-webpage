import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Review } from "@/shared/components/composite/review-card/review-card";
import { ReviewsCarousel } from "./reviews-carousel";

const REVIEWS: Review[] = [
  {
    id: "andreea",
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
    id: "mihai",
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
    id: "elena",
    name: "Elena Dumitru",
    role: "Whitening",
    title: "Worth every minute",
    text: "I drove two hours each way and would do it again. Painless, gorgeous results, and the kindest staff.",
    rating: 5,
  },
  {
    id: "radu",
    name: "Radu Marin",
    role: "Routine cleaning",
    title: "First clinic without fear",
    text: "I have always been anxious at the dentist. Here, for the first time, I felt completely safe. They listened.",
    rating: 4,
  },
  {
    id: "ioana",
    name: "Ioana Stan",
    role: "Orthodontics",
    title: "Like a different person",
    text: "Eighteen months of clear aligners, weekly check-ins, zero pressure. My alignment and bite are finally right.",
    rating: 5,
    avatar: {
      src: "https://api.dicebear.com/7.x/initials/svg?seed=IS&backgroundColor=8377a3&textColor=ffffff",
      alt: "Avatar of Ioana Stan",
    },
  },
  {
    id: "cristian",
    name: "Cristian Voicu",
    role: "Full mouth plan",
    title: "They saw the whole picture",
    text: "Other clinics gave me a price. Premium Smile gave me a plan. Three years later, my mouth is healthy.",
    rating: 4,
  },
  {
    id: "ana",
    name: "Ana Petrescu",
    role: "Family patient",
    title: "My kids actually ask to go",
    text: "Two children, zero tantrums. The pediatric room and the staff make every visit feel like an adventure.",
    rating: 5,
    avatar: {
      src: "https://api.dicebear.com/7.x/initials/svg?seed=AP2&backgroundColor=8377a3&textColor=ffffff",
      alt: "Avatar of Ana Petrescu",
    },
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
        id: "andreea",
        name: "Andreea Popescu",
        role: "Veneers patient",
        title: "Confidence restored",
        text: "Premium Smile transformed my confidence. The team explained every step.",
        rating: 5,
      },
    ],
  },
};
