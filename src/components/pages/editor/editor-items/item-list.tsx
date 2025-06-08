import { observer } from "mobx-react-lite"
import React from "react"

import {
	ItemActionCallback,
	leftColumnWidth,
} from "@/components/pages/editor/post-editor"
import { EditorItemType } from "@/stores/editor-item"
import InsertDivider from "./insert-divider"
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
						<div
							key={item.id}
							style={{
								paddingLeft: isMobile ? 0 : `${leftColumnWidth}px`,
								position: "relative",
							}}
							onMouseOver={
								isMobile ? undefined : () => onShowItemMenu(item, true)
							}
							onMouseOut={
								isMobile ? undefined : () => onShowItemMenu(item, false)
							}
							onFocus={() => {}}
							onBlur={() => {}}
						>
							{isMobile}
							<Item
								item={item}
								onClick={onSelect}
								onAction={onAction}
								preferOriginal={preferOriginal}
								isMobile={isMobile}
							/>
						</div>
					</>
				))}
				<InsertDivider anchor={undefined} isMobile={isMobile} />
			</div>
		)
	},
)

export default ItemList
