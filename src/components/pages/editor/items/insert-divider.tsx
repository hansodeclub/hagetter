import { TypeIcon } from "lucide-react"
import React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { leftColumnWidth } from "@/components/pages/editor/post-editor"
import { isTextSize } from "@/entities/post"
import { observer, useEditor } from "@/stores"
import TextEdit from "../edit-items/text-edit"

export interface InsertDividerProps {
	anchor?: string
	isMobile?: boolean
}

export const InsertDivider: React.FC<InsertDividerProps> = observer(
	({ anchor, isMobile }) => {
		const editor = useEditor()
		const [mouseOver, setMouseOver] = React.useState(false)
		const [insertTextMode, setInsertTextMode] = React.useState(false)

		const onInsertText = (text: string, size: string, color: string) => {
			if (isTextSize(size)) {
				editor.addText(text, anchor, size, color, undefined)
				setInsertTextMode(false)
				setMouseOver(false)
			} else {
				console.error("Invalid size", size)
			}
		}

		if (insertTextMode) {
			return (
				<div style={{ marginLeft: isMobile ? 0 : `${leftColumnWidth}px` }}>
					<TextEdit
						onSubmit={onInsertText}
						onCancel={() => setInsertTextMode(false)}
					/>
				</div>
			)
		}

		return (
			<div
				className={cn(
					"relative flex h-8 items-center justify-center",
					"before:-translate-y-1/2 before:absolute before:top-1/2 before:left-0 before:h-px before:w-full before:border-black/20 before:border-t before:transition-opacity before:duration-300",
					isMobile
						? "before:opacity-100"
						: "before:opacity-0 hover:before:opacity-100",
				)}
				style={{ marginLeft: isMobile ? 0 : `${leftColumnWidth}px` }}
				onMouseEnter={isMobile ? undefined : () => setMouseOver(true)}
				onMouseLeave={isMobile ? undefined : () => setMouseOver(false)}
			>
				<div
					className={cn(
						"relative z-10 transition-opacity duration-300",
						mouseOver || isMobile ? "opacity-100" : "opacity-0",
					)}
				>
					<Button
						variant="outline"
						size="sm"
						className={cn(
							"h-8 w-8 rounded-full border bg-white p-0 transition-colors hover:bg-gray-50",
							isMobile ? "border-black/20" : "border-gray-600",
						)}
						onClick={() => setInsertTextMode(true)}
					>
						<TypeIcon
							className={cn(
								"h-4 w-4",
								isMobile ? "text-black/20" : "text-gray-600",
							)}
						/>
					</Button>
				</div>
			</div>
		)
	},
)

export default InsertDivider
