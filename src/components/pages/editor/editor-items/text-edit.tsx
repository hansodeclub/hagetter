import React from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { EditorItemType } from "@/stores/editor-item"
import { ItemActionCallback } from "../post-editor"

import TextFormatSelector from "@/components/pages/editor/text-format-selector"

export interface TextEditProps {
	initialSize?: string
	initialColor?: string
	initialText?: string
	onSubmit: (text: string, size: string, color: string) => void
	onCancel: () => void
}

export const TextEdit: React.FC<TextEditProps> = ({
	onSubmit,
	onCancel,
	initialText,
	initialSize,
	initialColor,
}) => {
	const [size, setSize] = React.useState(initialSize ?? "h3")
	const [color, setColor] = React.useState(initialColor ?? "#000")
	const [text, setText] = React.useState(initialText ?? "")

	return (
		<div className="my-4">
			<Textarea
				rows={2}
				value={text}
				onChange={(event) => setText(event.target.value)}
				className="w-full"
			/>
			<div className="mt-2 flex items-center">
				<div>
					<TextFormatSelector
						size={size}
						onSizeChange={setSize}
						color={color}
						onColorChange={setColor}
					/>
				</div>
				<div className="flex-1" />
				<div>
					<Button
						variant="outline"
						onClick={() => onCancel()}
						className="w-28"
					>
						キャンセル
					</Button>
				</div>
				<div className="ml-2">
					<Button
						onClick={() => onSubmit(text, size, color)}
						className="w-28"
					>
						追加
					</Button>
				</div>
			</div>
		</div>
	)
}

export const TextItemMenu: React.FC<{
	item: EditorItemType
	onAction: ItemActionCallback
}> = ({ item, onAction }) => {
	return (
		<div>
			<Button
				variant="outline"
				size="sm"
				aria-label="delete"
				onClick={() => onAction?.(item, { type: "delete" })}
				className="h-8 w-8 border-gray-400 p-0 text-gray-600"
			>
				<Trash2 className="h-4 w-4" />
			</Button>
		</div>
	)
}
