import type { Meta, StoryObj } from "@storybook/react";
import { TextFiled } from "../../lib";

const meta = {
  title: "Example/Input",
  component: TextFiled,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof TextFiled>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    placeholder: "Placeholder",
  },
};
