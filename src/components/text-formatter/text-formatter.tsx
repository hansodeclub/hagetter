import React from "react"

import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
	CircleArrowDownIcon,
	CircleArrowUpIcon,
	TrashIcon,
} from "lucide-react"

import { Body2Icon } from "../icons/body2"
import { H3Icon } from "../icons/h3"
import { H6Icon } from "../icons/h6"
import Swatch from "./swatch"

export const defaultColors = [
	"#000000",
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
	"#ff0000",
	"#00ff00",
	"#0000ff",
	"#ffffff",
]

const StyledDivider: React.FC = () => (
	<div className="mx-2 h-8 w-px bg-gray-300" />
)

export interface ChangeEvent {
	size?: string
	color?: string
	bold?: boolean
	italic?: boolean
}

export interface TextFormatterProps {
	text: string
	selected?: boolean
	color?: string
	size?: string
	onUnselect?: () => void
	onChange: (event: ChangeEvent) => void
	onMove: (direction: "up" | "down") => void
	onRemove: () => void
}

const TextFormatter: React.FC<TextFormatterProps> = ({
	text,
	onUnselect,
	size,
	color,
	onChange,
	onMove,
	onRemove,
}) => {
	return (
		<div className="w-[340px] rounded-t-lg bg-white bg-opacity-90 p-2 shadow-lg">
			<div className="flex justify-between text-xs">
				<div>{text}</div>
				<div onClick={onUnselect} className="cursor-pointer underline">
					選択解除
				</div>
			</div>
			<div className="mt-2 flex items-end justify-between text-gray-500">
				<Button
					aria-label="delete selected item"
					variant="ghost"
					size="icon"
					onClick={() => onRemove()}
					className="text-gray-500"
				>
					<TrashIcon />
				</Button>
				<StyledDivider />
				<Button
					aria-label="move up"
					variant="ghost"
					size="icon"
					onClick={() => onMove("up")}
					className="text-gray-500"
				>
					<CircleArrowUpIcon />
				</Button>

				<Button
					aria-label="move down"
					variant="ghost"
					size="icon"
					onClick={() => onMove("down")}
					className="text-gray-500"
				>
					<CircleArrowDownIcon />
				</Button>
				<StyledDivider />
				<ToggleGroup
					type="single"
					value={size}
					onValueChange={(size) => onChange({ size })}
				>
					<ToggleGroupItem value="h3">
						<H3Icon />
					</ToggleGroupItem>
					<ToggleGroupItem value="h6">
						<H6Icon />
					</ToggleGroupItem>
					<ToggleGroupItem value="body2">
						<Body2Icon />
					</ToggleGroupItem>
				</ToggleGroup>
			</div>
			<div className="mt-2 grid grid-cols-7 gap-1">
				{defaultColors.map((c) => (
					<Swatch
						key={c}
						color={c}
						selected={color === c}
						onClick={() => onChange({ color: c })}
					/>
				))}
			</div>
		</div>
	)
}

export default TextFormatter
