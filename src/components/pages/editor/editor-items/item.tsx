import { observer } from "mobx-react-lite"
import React from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"

import { TextItem } from "@/components/item/text-item"
import { ItemActionCallback } from "@/components/pages/editor/post-editor"
import TextFormatSelector from "@/components/pages/editor/text-format-selector"
import { Toot } from "@/components/toot"
import { EditorItemType } from "@/stores/editor-item"
import { TextSize } from "@/entities/post"
import { TextEdit } from "../editor-items/text-edit"
import {
	DeleteItemButton,
	EditItemButton,
	MoveDownItemButton,
	MoveUpItemButton,
} from "../menus/buttons"

export interface ItemProps {
	item: EditorItemType
	onClick?: (item: EditorItemType) => void
	preferOriginal?: boolean
	onAction?: ItemActionCallback
	isMobile?: boolean
}

const PopupMenu: React.FC<{ children?: React.ReactNode; show: boolean }> = ({
	children,
	show,
}) => <div className="absolute top-0 left-0">{show && children}</div>

const FormatEdit: React.FC<{ item: EditorItemType }> = observer(({ item }) => {
	return (
		<div className="flex items-center">
			<div className="ml-2 pb-2 pt-1">
				<TextFormatSelector
					size={item.size ?? false}
					onSizeChange={(size) => item.setSize(size)}
					color={item.color ?? false}
					onColorChange={(color) => item.setColor(color)}
				/>
			</div>
			<div>
				<Button
					variant="ghost"
					size="sm"
					className="ml-3 h-8 w-8 p-0"
					onClick={() => item.setEditMode(false)}
				>
					<X className="h-6 w-6" />
				</Button>
			</div>
		</div>
	)
})

const Item: React.FC<ItemProps> = observer(
	({ item, onClick, preferOriginal, onAction, isMobile }) => {
		const data = item.data

		const onChangeText = (item: EditorItemType, text: string, size: TextSize, color: string) => {
			item.setFormat(size, color)
			item.setText(text)
			item.setEditMode(false)
		}

		if (data.type === "status") {
			return (
				<>
					<PopupMenu show={(item.showMenu || item.selected) && !isMobile}>
						<div className="flex flex-col gap-1">
							<div className="flex gap-1">
								<DeleteItemButton item={item} onAction={onAction} />
								<EditItemButton item={item} onAction={onAction} />
							</div>
							<div className="flex gap-1">
								<MoveUpItemButton item={item} onAction={onAction} />
								<MoveDownItemButton item={item} onAction={onAction} />
							</div>
						</div>
					</PopupMenu>
					<li style={{ display: "inline" }}>
						{item.editMode && <FormatEdit item={item} />}
						<Toot
							variant={item.size}
							color={item.color}
							onClick={onClick && (() => onClick(item))}
							status={data.data}
							preferOriginal={preferOriginal}
							className={item.selected ? "bg-red-50" : ""}
						/>
					</li>
					<div />
				</>
			)
		} else if (data.type === "text") {
			return (
				<>
					<PopupMenu show={(item.showMenu || item.selected) && !isMobile}>
						<div className="flex flex-col gap-1">
							<div className="flex gap-1">
								<DeleteItemButton item={item} onAction={onAction} />
								<EditItemButton item={item} onAction={onAction} />
							</div>
							<div className="flex gap-1">
								<MoveUpItemButton item={item} onAction={onAction} />
								<MoveDownItemButton item={item} onAction={onAction} />
							</div>
						</div>
					</PopupMenu>
					{item.editMode && (
						<TextEdit
							onSubmit={(text, size, color) => {
								onChangeText(item, text, size as TextSize, color)
							}}
							onCancel={() => item.setEditMode(false)}
							initialSize={data.size}
							initialColor={data.color}
							initialText={data.data.text}
						/>
					)}
					{!item.editMode && (
						<div className="relative">
							<TextItem
								text={data.data.text}
								variant={data.size}
								color={data.color}
								onClick={onClick && (() => onClick(item))}
								className={item.selected ? "bg-red-50" : ""}
							/>
							{isMobile && (
								<div className="absolute right-1 top-1">
									<EditItemButton item={item} onAction={onAction} />
								</div>
							)}
						</div>
					)}
				</>
			)
		} else {
			throw Error(`Unknown item type: ${item.type}`)
		}
	},
)

export default Item
