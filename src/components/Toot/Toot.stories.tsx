import { Meta, StoryObj } from "@storybook/react"

import { fromMastoStatus } from "@/entities/status"
import Toot, { StatusProps } from "./toot"

import linkStatus from "./testdata/link.json"
import mediaStatus from "./testdata/media.json"
import pollStatus from "./testdata/poll.json"
import unlistedStatus from "./testdata/unlisted.json"

const meta: Meta = {
	title: "Toot",
	component: Toot,
}
export default meta

type Story = StoryObj<StatusProps>
export const Default: Story = {
	args: {
		status: fromMastoStatus(linkStatus as any, "handon.club"),
	},
}

export const Poll: Story = {
	args: {
		status: fromMastoStatus(pollStatus as any, "handon.club"),
	},
}

export const MultiMedia: Story = {
	args: {
		status: fromMastoStatus(mediaStatus as any, "handon.club"),
	},
}

export const Unlisted: Story = {
	args: {
		status: fromMastoStatus(unlistedStatus as any, "handon.club"),
	},
}
