import React from "react"
import { GithubPicker } from "react-color"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Body2Icon } from "@/components/icons/body2"
import { H3Icon } from "@/components/icons/h3"
import { H6Icon } from "@/components/icons/h6"

import { TextSize, isTextSize } from "@/entities/post"


const colors = [
	"#B80000",
	"#DB3E00",
	"#FCCB00",
	"#008B02",
	"#006B76",
	"#1273DE",
	"#004DCF",
	"#5300EB",
	"#EB9694",
	"#FAD0C3",
	"#FEF3BD",
	"#C1E1C5",
	"#BEDADC",
	"#C4DEF6",
	"#BED3F3",
	"#D4C4FB",
	"#000000",
	"#ff0000",
	"#00ff00",
	"#0000ff",
	"#ffffff",
]

export interface TextFormatSelectorProps {
	size: string | false
	color: string | false
	onSizeChange: (size: TextSize) => void
	onColorChange: (color: string) => void
}

const TextFormatSelector: React.FC<TextFormatSelectorProps> = ({
	size,
	color,
	onSizeChange,
	onColorChange,
}) => {
	const [showPicker, setShowPicker] = React.useState(false)
	const handleSizeChange = (newSize: string) => {
		if (!isTextSize(newSize)) {
			throw Error("Invalid text size")
		}

		onSizeChange(newSize)
	}

	const handleColorChange = (newColor: { hex: string }) => {
		setShowPicker(false)
		if (color !== newColor.hex) {
			onColorChange(newColor.hex)
		}
	}

	return (
		<div className="flex items-center gap-2">
			<ToggleGroup
				type="single"
				value={size || undefined}
				onValueChange={handleSizeChange}
				size="sm"
			>
				<ToggleGroupItem value="h3">
					<H3Icon className="h-5 w-5" />
				</ToggleGroupItem>
				<ToggleGroupItem value="h6">
					<H6Icon className="h-4 w-4" />
				</ToggleGroupItem>
				<ToggleGroupItem value="body2">
					<Body2Icon className="h-3.5 w-3.5" />
				</ToggleGroupItem>
			</ToggleGroup>
			<div className="relative">
				<div
					className="inline-block cursor-pointer rounded-sm bg-white p-1 shadow-sm ring-1 ring-black/10"
					onClick={() => setShowPicker(!showPicker)}
				>
					<div
						className="h-3.5 w-9 rounded-sm"
						style={{ backgroundColor: color || "black" }}
					/>
				</div>
				{showPicker && (
					<div className="absolute z-10">
						<div
							className="fixed inset-0"
							onClick={() => setShowPicker(false)}
						/>
						<GithubPicker
							colors={colors}
							color={color}
							onChange={handleColorChange}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default TextFormatSelector
