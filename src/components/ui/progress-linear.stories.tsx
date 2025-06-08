import type { Meta, StoryObj } from "@storybook/react"
import { ProgressLinear } from "./progress-linear"

const meta: Meta<typeof ProgressLinear> = {
  title: "UI/ProgressLinear",
  component: ProgressLinear,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    indeterminate: {
      control: "boolean",
    },
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 50,
  },
}

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
}

export const ZeroProgress: Story = {
  args: {
    value: 0,
  },
}

export const FullProgress: Story = {
  args: {
    value: 100,
  },
}

export const CustomStyling: Story = {
  args: {
    indeterminate: true,
    className: "h-2 bg-red-100",
  },
}