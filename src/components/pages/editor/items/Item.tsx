import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import { Stack } from "@mui/material"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import { observer } from "mobx-react-lite"
import React from "react"

import {
	ItemActionCallback,
	leftColumnWidth,
} from "@/components/pages/editor/post-editor"
import TextFormatSelector from "@/components/pages/editor/text-format-selector"
import { Toot } from "@/components/toot"
import { EditorItemType } from "@/stores/editor-item"
import TextEdit from "../edit-items/text-edit"
import {
	DeleteItemButton,
	EditItemButton,
	MoveDownItemButton,
	MoveUpItemButton,
} from "../menus/buttons"
import { TextItem } from "./text-item"

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
		<Box sx={{ display: "flex", alignItems: "center" }}>
			<Box sx={{ ml: 2, pt: 1, pb: 2 }}>
				<TextFormatSelector
					size={item.size ?? false}
					onSizeChange={(size) => item.setSize(size)}
					color={item.color ?? false}
					onColorChange={(color) => item.setColor(color)}
				/>
			</Box>
			<Box>
				<IconButton sx={{ ml: 3 }} size="small">
					<HighlightOffIcon
						fontSize="large"
						onClick={() => item.setEditMode(false)}
					/>
				</IconButton>
			</Box>
		</Box>
	)
})

const Item: React.FC<ItemProps> = observer(
	({ item, onClick, preferOriginal, onAction, isMobile }) => {
		const data = item.data

		const onChangeText = (item, text, size, color) => {
			item.setFormat(size, color)
			item.setText(text)
			item.setEditMode(false)
		}

		if (data.type === "status") {
			return (
				<>
					<PopupMenu show={(item.showMenu || item.selected) && !isMobile}>
						<Stack spacing={1}>
							<Stack direction="row" spacing={1}>
								<DeleteItemButton item={item} onAction={onAction} />
								<EditItemButton item={item} onAction={onAction} />
							</Stack>
							<Stack direction="row" spacing={1}>
								<MoveUpItemButton item={item} onAction={onAction} />
								<MoveDownItemButton item={item} onAction={onAction} />
							</Stack>
						</Stack>
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
						<Stack spacing={1}>
							<Stack direction="row" spacing={1}>
								<DeleteItemButton item={item} onAction={onAction} />
								<EditItemButton item={item} onAction={onAction} />
							</Stack>
							<Stack direction="row" spacing={1}>
								<MoveUpItemButton item={item} onAction={onAction} />
								<MoveDownItemButton item={item} onAction={onAction} />
							</Stack>
						</Stack>
					</PopupMenu>
					{item.editMode && (
						<TextEdit
							onSubmit={(text, size, color) => {
								onChangeText(item, text, size, color)
							}}
							onCancel={() => item.setEditMode(false)}
							initialSize={data.size}
							initialColor={data.color}
							initialText={data.data.text}
						/>
					)}
					{!item.editMode && (
						<Box sx={{ position: "relative" }}>
							<TextItem
								text={data.data.text}
								variant={data.size}
								color={data.color}
								onClick={onClick && (() => onClick(item))}
								className={item.selected ? "bg-red-50" : ""}
							/>
							{isMobile && (
								<Box sx={{ position: "absolute", right: 5, top: 5 }}>
									<EditItemButton item={item} onAction={onAction} />
								</Box>
							)}
						</Box>
					)}
				</>
			)
		} else {
			throw Error(`Unknown item type: ${item.type}`)
		}
	},
)

export default Item
