import type { Meta, StoryObj } from "@storybook/react-vite";
import type { StaffMember } from "./helping-staff-card/helping-staff-card";
import { HelpingStaffGrid } from "./helping-staff-grid";

const portrait = (seed: string): { src: string; alt: string } => ({
  src: `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=8377a3&textColor=ffffff`,
  alt: `Portrait placeholder ${seed}`,
});

const ANA: StaffMember = {
  id: "ana-georgescu",
  name: "Ana Georgescu",
  roles: ["Dental Assistant", "Patient Coordinator"],
  photo: portrait("AG"),
};
const MIHAI: StaffMember = {
  id: "mihai-ionescu",
  name: "Mihai Ionescu",
  roles: ["Dental Hygienist"],
  photo: portrait("MI"),
};
const RALUCA: StaffMember = {
  id: "raluca-pop",
  name: "Raluca Pop",
  roles: ["Office Manager"],
  photo: portrait("RP"),
};
const IOANA: StaffMember = {
  id: "ioana-stan",
  name: "Ioana Stan",
  roles: ["Receptionist"],
  photo: portrait("IS"),
};
const VLAD: StaffMember = {
  id: "vlad-marinescu",
  name: "Vlad Marinescu",
  roles: ["Sterilization Tech"],
  photo: portrait("VM"),
};
const SOFIA: StaffMember = {
  id: "sofia-radu",
  name: "Sofia Radu",
  roles: ["Patient Coordinator"],
  photo: portrait("SR"),
};

const meta: Meta<typeof HelpingStaffGrid> = {
  title: "Composite/HelpingStaffGrid",
  component: HelpingStaffGrid,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof HelpingStaffGrid>;

export const ThreeStaff: Story = {
  args: {
    staff: [ANA, MIHAI, RALUCA],
    sectionEyebrow: "Behind every appointment",
    sectionTitle: "Our helping staff",
  },
};

export const SixStaff: Story = {
  args: {
    staff: [ANA, MIHAI, RALUCA, IOANA, VLAD, SOFIA],
    sectionTitle: "Our helping staff",
  },
};

export const OneStaff: Story = {
  args: {
    staff: [ANA],
    sectionTitle: "Our helping staff",
  },
};
