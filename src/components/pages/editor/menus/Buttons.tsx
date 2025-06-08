import React from "react"
import { ArrowDown, ArrowUp, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

import { ItemActionCallback } from "@/components/pages/editor/post-editor"
import { EditorItemType } from "@/stores/editor-item"

export const DeleteItemButton: React.FC<{
	item: EditorItemType
	onAction?: ItemActionCallback
}> = ({ item, onAction }) => {
	return (
		<Button
			variant="outline"
			size="sm"
			aria-label="delete"
			onClick={() => onAction?.(item, { type: "delete" })}
			className="h-8 w-8 rounded-full border-gray-400 p-0 text-gray-600"
		>
			<Trash2 className="h-4 w-4" />
		</Button>
	)
}

export const EditItemButton: React.FC<{
	item: EditorItemType
	onAction?: ItemActionCallback
}> = ({ item, onAction }) => {
	return (
		<Button
			variant="outline"
			size="sm"
			aria-label="edit"
			onClick={() => onAction?.(item, { type: "edit" })}
			className="h-8 w-8 rounded-full border-gray-400 bg-white p-0 text-gray-600"
		>
			<Edit className="h-4 w-4" />
		</Button>
	)
}

export const MoveUpItemButton: React.FC<{
	item: EditorItemType
	onAction?: ItemActionCallback
}> = ({ item, onAction }) => {
	return (
		<Button
			variant="outline"
			size="sm"
			aria-label="move up"
			onClick={() => onAction?.(item, { type: "moveUp" })}
			className="h-8 w-8 rounded-full border-gray-400 p-0 text-gray-600"
		>
			<ArrowUp className="h-4 w-4" />
		</Button>
	)
}

export const MoveDownItemButton: React.FC<{
	item: EditorItemType
	onAction?: ItemActionCallback
}> = ({ item, onAction }) => {
	return (
		<Button
			variant="outline"
			size="sm"
			aria-label="move down"
			onClick={() => onAction?.(item, { type: "moveDown" })}
			className="h-8 w-8 rounded-full border-gray-400 p-0 text-gray-600"
		>
			<ArrowDown className="h-4 w-4" />
		</Button>
	)
}
