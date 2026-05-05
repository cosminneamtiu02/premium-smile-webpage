import type { Meta, StoryObj } from "@storybook/react-vite";
import { HelpingStaffCard, type StaffMember } from "./helping-staff-card";

const ANA: StaffMember = {
  id: "ana-georgescu",
  name: "Ana Georgescu",
  roles: ["Dental Assistant", "Patient Coordinator"],
  photo: {
    src: "https://api.dicebear.com/7.x/initials/svg?seed=AG&backgroundColor=8377a3&textColor=ffffff",
    alt: "Portrait of Ana Georgescu",
  },
};

const meta: Meta<typeof HelpingStaffCard> = {
  title: "Composite/HelpingStaffGrid/HelpingStaffCard",
  component: HelpingStaffCard,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof HelpingStaffCard>;

export const Default: Story = {
  args: { staff: ANA },
};
