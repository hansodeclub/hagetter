import React from "react"

import { useEditor } from "@/stores"
import { EditorItemType } from "@/stores/editor-item"
import TextField from "@mui/material/TextField"
import { observer } from "mobx-react-lite"
import ItemList from "./items/item-list"

const HowTo: React.FC = () => {
	return (
		<div className="m-3 bg-gray-100 p-2">
			<p className="text-center font-semibold">使い方</p>
			<ul className="mt-3 list-inside list-disc">
				<li>ポストを追加するには右のタイムラインをクリックします</li>
				<li>時系列は上が古く下が新しくなるようにします</li>
				<li>下部のメニューから時系列順にソート出来ます</li>
			</ul>
		</div>
	)
}

export type ItemAction = {
	type: "delete" | "moveUp" | "moveDown" | "edit"
}

export type ItemActionCallback = (
	item: EditorItemType,
	action: ItemAction,
) => void

export const leftColumnWidth = 80

export interface PostEditorProps extends React.HTMLAttributes<HTMLDivElement> {
	isMobile?: boolean
}

const PostEditor: React.FC<PostEditorProps> = observer(
	({ isMobile, ...props }) => {
		const editor = useEditor()

		const onSelect = (item: EditorItemType) => {
			editor.toggleSelected(item.id)
			return false
		}

		const onShowItemMenu = (item: EditorItemType, showMenu: boolean) => {
			editor.setShowMenu(item.id, showMenu)
		}

		const onItemAction = (item: EditorItemType, action: ItemAction) => {
			switch (action.type) {
				case "moveUp":
					editor.moveItem(item.id, "up")
					break
				case "moveDown":
					editor.moveItem(item.id, "down")
					break
				case "delete":
					editor.removeItem(item.id)
					break
				case "edit":
					editor.setEdit(item.id, true)
					break
			}
		}

		return (
			<div {...props}>
				<div className="flex">
					<div
						className="justify-center align-middle font-bold"
						style={{
							width: leftColumnWidth,
						}}
					>
						<p>タイトル</p>
					</div>
					<div className="grow">
						<TextField
							fullWidth
							style={{ backgroundColor: "white" }}
							defaultValue={editor.title}
							onChange={(event) => editor.setTitle(event.target.value)}
						/>
					</div>
				</div>
				<div className="mt-1 flex">
					<div
						className="justify-center align-middle font-bold"
						style={{
							width: leftColumnWidth,
						}}
					>
						説明文
					</div>
					<div className="grow">
						<TextField
							multiline
							fullWidth
							rows={4}
							style={{ backgroundColor: "white" }}
							defaultValue={editor.description}
							onChange={(event) => editor.setDescription(event.target.value)}
						/>
					</div>
				</div>
				<div className="mt-2">
					<ItemList
						onSelect={onSelect}
						items={editor.items}
						onShowItemMenu={onShowItemMenu}
						onAction={onItemAction}
						preferOriginal
						isMobile={isMobile}
					/>
					{editor.items.length === 0 && <HowTo />}
				</div>
			</div>
		)
	},
)

export default PostEditor
