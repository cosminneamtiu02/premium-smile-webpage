import type { Meta, StoryObj } from "@storybook/react-vite";
import { RichText } from "./rich-text";

const meta: Meta<typeof RichText> = {
  title: "UI/RichText",
  component: RichText,
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof RichText>;

export const MarkerString: Story = {
  render: () => (
    <p className="max-w-xl text-base leading-relaxed text-fg-muted">
      <RichText value="With over <b>fifteen years of experience</b> in aesthetic and restorative dentistry, Dr. Marin leads the clinic with a commitment to <b>detail driven, patient first care</b>." />
    </p>
  ),
};

export const ArrayParts: Story = {
  render: () => (
    <p className="max-w-xl text-base leading-relaxed text-fg-muted">
      <RichText
        parts={[
          "Known for her ",
          { bold: "gentle approach" },
          " and ",
          { bold: "warm bedside manner" },
          ", Dr. Stoica makes routine dental care a calm, reassuring experience.",
        ]}
      />
    </p>
  ),
};

export const PlainText: Story = {
  args: { value: "No markers in this string." },
};
