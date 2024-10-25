import React from "react"

import { observer } from "mobx-react-lite"

import Box from "@mui/material/Box"

import {
	ItemActionCallback,
	leftColumnWidth,
} from "@/components/pages/editor/post-editor"
import InsertDivider from "./insert-divider"

import { EditorItemType } from "@/stores/editor-item"

import Item from "./item"

export interface ItemListProps {
	items: EditorItemType[]
	onSelect: (item: EditorItemType) => boolean
	onShowItemMenu: (item: EditorItemType, showMenu: boolean) => void
	onAction: ItemActionCallback
	preferOriginal?: boolean
	isMobile?: boolean
}

const ItemList: React.FC<ItemListProps> = observer(
	({ items, onSelect, onShowItemMenu, onAction, preferOriginal, isMobile }) => {
		return (
			<div>
				{items.map((item, index) => (
					<>
						<InsertDivider anchor={item.id} isMobile={isMobile} />
						<Box
							key={item.id}
							sx={{
								paddingLeft: isMobile ? 0 : `${leftColumnWidth}px`,
								position: "relative",
							}}
							onMouseOver={
								isMobile ? undefined : () => onShowItemMenu(item, true)
							}
							onMouseOut={
								isMobile ? undefined : () => onShowItemMenu(item, false)
							}
						>
							{isMobile}
							<Item
								item={item}
								onClick={onSelect}
								onAction={onAction}
								preferOriginal={preferOriginal}
								isMobile={isMobile}
							/>
						</Box>
					</>
				))}
				<InsertDivider anchor={undefined} isMobile={isMobile} />
			</div>
		)
	},
)

export default ItemList
