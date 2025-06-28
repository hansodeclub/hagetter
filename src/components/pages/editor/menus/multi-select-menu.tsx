import { cn } from "@/lib/utils"
import React from "react"

import { TextFormatter } from "@/components/text-formatter"
import { isTextSize } from "@/entities/post"
import { observer, useEditor } from "@/stores"

export interface MultiSelectMenuProps
	extends React.HTMLAttributes<HTMLDivElement> {
	isMobile?: boolean
	color?: string
	size?: string
}

export const MultiSelectMenu: React.FC<MultiSelectMenuProps> = observer(
	({ isMobile, color, size, className }) => {
		const editor = useEditor()

		const onChange = ({ size, color }: { size?: string; color?: string }) => {
			if (size && isTextSize(size)) {
				editor.setSelectedFormat(size)
			}

			if (color) {
				editor.setSelectedFormat(undefined, color)
			}
		}

		const onMove = (direction: "up" | "down") => {
			editor.moveSelectedItem(direction)
		}

		return (
			<div
				className="-translate-x-1/2 fixed bottom-14"
				style={{ left: "min(45%, 380px)" }}
			>
				<div
					className={cn(
						"transform transition-all duration-300 ease-in-out",
						editor.selectedCount > 0
							? "translate-y-0 opacity-100"
							: "pointer-events-none translate-y-4 opacity-0",
					)}
				>
					<div className="mb-1 flex items-center rounded-t-lg border-gray-300 border-t border-r border-l">
						<TextFormatter
							text={`${editor.selectedCount}個のアイテムを選択中`}
							size={size}
							color={color}
							onChange={onChange}
							onMove={onMove}
							onUnselect={() => editor.resetSelect()}
							onRemove={() => editor.removeSelectedItem()}
						/>
					</div>
				</div>
			</div>
		)
	},
)

export default MultiSelectMenu
