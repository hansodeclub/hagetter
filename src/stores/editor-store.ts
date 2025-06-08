import dayjs from "dayjs"
import { cast, types } from "mobx-state-tree"

import {
	HagetterItem,
	PostVisibility,
	StatusItem,
	TextItem,
	TextSize,
	isTextSize,
} from "@/entities/post"
import { Status } from "@/entities/status"

import { EditorItem } from "./editor-item"

const PostVisibilityModel = types.enumeration<PostVisibility>(
	"PostVisibility",
	["public", "noindex", "unlisted", "draft"],
)

const generateId = () => {
	return Date.now()
}

export const EditorStore = types
	.model("EditorModel", {
		hid: types.optional(types.string, ""),
		title: types.optional(types.string, ""),
		description: types.optional(types.string, ""),
		visibility: types.optional(PostVisibilityModel, "public"),
		items: types.optional(types.array(EditorItem), []),
	})
	.actions((self) => ({
		setId(hid: string) {
			self.hid = hid
		},
		setTitle(title: string) {
			self.title = title
		},
		setDescription(description: string) {
			self.description = description
		},
		setVisibility(visibility: PostVisibility) {
			self.visibility = visibility
		},
		// 一番下の選択済みアイテムを取得する(新規アイテム挿入は一番下に入れる)
		getAnchor(): string | undefined {
			for (let i = self.items.length - 1; i >= 0; i--) {
				if (self.items[i].selected) return self.items[i].id
			}
			return undefined
			//const item = self.items.find(item => item.selected);
			//return item ? item.id : undefined;
		},
		clear() {
			self.title = ""
			self.description = ""
			self.items = cast([])
			self.visibility = "public"
		},
		setFormat(id: string, size?: TextSize, color?: string) {
			for (const item of self.items) {
				if (item.id === id) {
					item.setFormat(size, color)
				}
			}
		},
		setSelectedFormat(size?: TextSize, color?: string) {
			if (size && !isTextSize(size)) throw Error("Invalid text size")

			for (const item of self.items) {
				if (item.selected) {
					item.setFormat(size, color)
				}
			}
		},
		setSelected(id: string, selected = true) {
			const item = self.items.find((item) => item.id === id)
			if (item) {
				item.setSelected(selected)
			}
		},
		toggleSelected(id: string) {
			const item = self.items.find((item) => item.id === id)
			if (item) {
				item.toggleSelected()
			}
		},
		resetSelect() {
			for (const item of self.items) {
				if (item.selected) item.setSelected(false)
			}
		},
		setShowMenu(id: string, showMenu: boolean) {
			const item = self.items.find((item) => item.id === id)
			if (item) {
				item.setShowMenu(showMenu)
			}
		},
		setEdit(id: string, editMode: boolean) {
			const item = self.items.find((item) => item.id === id)
			if (item) {
				item.setEditMode(editMode)
			}
		},
		recalculateSortKeys() {
			let lastSortKey = dayjs().add(10, "year").valueOf()

			for (let i = self.items.length - 1; i >= 0; i--) {
				// Statusのソートキーを設定する
				if (self.items[i].data.type === "status") {
					self.items[i].sortKey = lastSortKey
					lastSortKey = self.items[i].sortKey
				} else {
					self.items[i].sortKey = lastSortKey - 1
					lastSortKey -= 1
				}
			}
		},
	}))
	.actions((self) => ({
		insertItem(item: HagetterItem, anchor?: string, sortKey?: number) {
			/**
			 * エディタにアイテムを挿入する
			 * anchorがあればその位置に、なければ一番下に挿入する
			 * ユーザーがアイテムをソートした場合は、sortKeyに基いて並べかえられる
			 */
			if (self.items.find((i) => item.id === i.id)) {
				return // duplicated item
			}

			const index = anchor
				? self.items.findIndex((i) => i.id === anchor)
				: self.items.length

			self.items.splice(index === -1 ? 0 : index, 0, {
				sortKey: sortKey ?? dayjs().valueOf(),
				data: item,
			})
			self.recalculateSortKeys()
		},
		removeItem(id: string) {
			self.items = cast(self.items.filter((item) => item.id !== id))
			self.recalculateSortKeys()
		},
		removeSelectedItem() {
			self.items = cast(self.items.filter((item) => !item.selected))
			self.recalculateSortKeys()
		},
		moveItem(id: string, direction: "up" | "down") {
			const index = self.items.findIndex((item) => item.id === id)
			if (index === -1) return

			const items = Array.from(self.items)

			const item = items[index]
			const targetIndex =
				direction === "up" ? index - 1 : direction === "down" ? index + 1 : -1

			if (targetIndex === -1) return

			items.splice(index, 1)
			items.splice(targetIndex, 0, item)
			self.items = cast(items)

			self.recalculateSortKeys()
		},
		/**
		 * 選択したStatusを上下に一つ移動する(複数選択も可)
		 * @param direction 動かす方向
		 */
		moveSelectedItem(direction: "up" | "down") {
			if (self.items.length <= 1) {
				return
			}

			if (
				(direction === "up" && self.items[0].selected) ||
				(direction === "down" && self.items[self.items.length - 1].selected)
			)
				return

			const start = direction === "up" ? 1 : self.items.length - 2
			const end = direction === "up" ? self.items.length : -1
			const step = direction === "up" ? 1 : -1
			const items = Array.from(self.items)
			for (let i = start; i !== end; i += step) {
				if (items[i].selected && !items[i - step].selected) {
					const tmp = self.items[i]
					items[i] = items[i - step]
					items[i - step] = tmp
				}
			}
			self.items = cast(items)
			self.recalculateSortKeys()
		},
		sort(by = "date") {
			// Array.sortは安定ソートになった
			self.items = cast(self.items.sort((a, b) => a.sortKey - b.sortKey))
		},
	}))
	.actions((self) => ({
		addStatus(
			status: Status,
			anchor?: string,
			size?: TextSize,
			color?: string,
			color2?: string,
		) {
			const item: StatusItem = {
				type: "status",
				id: status.id,
				color: color ?? "#000000",
				color2,
				size: size ?? "inherit",
				data: status,
			}
			const sortKey = dayjs(status.createdAt).valueOf()

			self.insertItem(item, anchor, sortKey)
		},
		addText(
			text: string,
			anchor?: string,
			size?: TextSize,
			color?: string,
			color2?: string,
			id?: string,
		) {
			const anchorIndex = anchor
				? self.items.findIndex((item) => item.id === anchor)
				: -1
			const sortKey =
				anchorIndex !== -1 ? self.items[anchorIndex].sortKey - 1 : id

			const item: TextItem = {
				type: "text",
				id: id ?? generateId().toString(),
				color: color ?? "#000000",
				color2,
				size: size ?? "inherit",
				data: { text },
			}

			self.insertItem(item, anchor, sortKey)
		},
		bulkAdd(items: HagetterItem[]) {
			self.items = cast(
				items.map((item) => ({
					sortKey:
						item.type === "status" ? dayjs(item.data.createdAt).valueOf() : 0,
					data: item,
				})),
			)
			self.recalculateSortKeys()
		},
	}))
	.views((self) => ({
		get itemIds() {
			return new Set<string>(self.items.map((item) => item.id))
		},
		get editing(): boolean {
			return (
				self.items.length > 0 || self.title !== "" || self.description !== ""
			)
		},
		get hasPrivateStatus() {
			return undefined !== self.items.find((item) => item.isPrivateStatus)
		},
		get selectedCount() {
			return self.items.filter((item) => item.selected).length
		},
		get selectedItems() {
			return self.items.filter((item) => item.selected)
		},
		/**
		 * 選択されているStatusのフォーマットを返す
		 * 複数選択されている場合は、colorとsizeは全て同じ値である時のみ返す
		 */
		get selectedItemsFormat() {
			const selectedItems = self.items.filter((item) => item.selected)
			if (selectedItems.length === 0) {
				return {
					color: undefined,
					size: undefined,
				}
			}
			const firstColor = selectedItems[0].color
			const firstSize = selectedItems[0].size

			return {
				color: selectedItems.every((item) => item.color === firstColor)
					? firstColor
					: undefined,
				size: selectedItems.every((item) => item.size === firstSize)
					? firstSize
					: undefined,
			}
		},
		get itemsSnapshot() {
			return self.items.map((item) => item.data)
		},
	}))

export default EditorStore
