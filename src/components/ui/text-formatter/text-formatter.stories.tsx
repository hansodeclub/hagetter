import { useArgs } from "@storybook/preview-api"
import { Meta, StoryObj } from "@storybook/react"

import TextFormatter from "./text-formatter"

const meta: Meta<typeof TextFormatter> = {
	component: TextFormatter,
	title: "TextFormatter",
}

export default meta

export const Selected: StoryObj<typeof TextFormatter> = {
	args: {
		text: "1個のアイテムを選択中",
		size: "h3",
		color: "#EB9694",
	},
	render: (args) => {
		const [{ onChange }, updateArgs] = useArgs()
		const handleChange = (newArgs) => {
			if (newArgs.color) {
				updateArgs({ color: newArgs.color })
			} else if (newArgs.size) {
				updateArgs({ size: newArgs.size })
			}

			onChange(newArgs)
		}

		return (
			<div
				style={{ padding: 20, paddingBottom: 0, backgroundColor: "#ffffff" }}
			>
				<TextFormatter {...args} onChange={handleChange} />
			</div>
		)
	},
}
